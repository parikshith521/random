//MODELS CLIENT BEHAVIOUR

import { WebSocketClient, StandardWebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
const endpoint = "ws://127.0.0.1:8081";
const ws: WebSocketClient = new StandardWebSocketClient(endpoint);
const user_id = 1000;

const enter_lobby = async () => {

    const url = "http://localhost:8080/api/lobby/enter"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({user_id: user_id})
    })

    console.log("CLIENT: ENTERED LOBBY SUCCESSFULLY");

    if(response) {
        ws.on("open", function() {
            console.log("ws connected!");
            ws.send(JSON.stringify({user_id: user_id}));
          });
          ws.on("message", function (message: string) {
            console.log(message);
          });
    }

    console.log("CLIENT: CONNECTION TO WS SUCCESSFULLY")

}

enter_lobby();