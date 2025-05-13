import { connect } from "@db/redis";
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";



const sessions: Map<string, string[]> = new Map();
const user_session: Map<string, string> = new Map();
const wss = new WebSocketServer(8082);

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (message: string) {
    const msg = JSON.parse(message);
    const user_id = msg.user_id;
    //find session id of user and remove user from that session, if session is empty, erase from map
    const session_id = user_session.get(user_id);

    if(session_id) {
        const players = sessions.get(session_id);
        if(players) {
            if(players.indexOf(user_id) != -1) players.splice(players.indexOf(user_id),1);
            if(players.length === 0) {
                sessions.delete(session_id);
                user_session.delete(user_id);
            }
        }
    }
    ws.close(1000);
  });
});



const redis = await connect({ hostname: "127.0.0.1", port: 6379 });
const sub = await connect({ hostname: "127.0.0.1", port: 6379 }); 
const pub = await connect({
    hostname: "127.0.0.1",
    port: 6379,
  });
  
const subscriber = sub.subscribe("Q_test");

console.log("Game Session Service is listening...");

for await (const { channel, message } of subscriber.receive()) {

  console.log(`Message from ${channel}: ${message}`);

  const len = await redis.llen("Q_test");
  if (len >= 5) {
    const players: string[] = [];

    for (let i = 0; i < 5; i++) {
      const player = await redis.lpop("Q_test");
      if (player) players.push(player);
    }

    const session_id = crypto.randomUUID();
    console.log(`Created game session ${session_id}:`, players);

    //store the session
    sessions.set(session_id, players);
    players.forEach((player) =>{
        user_session.set(player, session_id)

    });

    await pub.publish("S_test", JSON.stringify({session_id, players}))

    await redis.set(`session:${session_id}`, JSON.stringify({ players }));
  }
}
