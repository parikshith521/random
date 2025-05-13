import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8081);

console.log("NOTIFS STARTED");

wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", function (message: string) {
    console.log("Message from socket: ", message);
    ws.send("Message Received");
  });
});
