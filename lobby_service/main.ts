import { Hono } from "hono";

const app = new Hono();
const port = 8080;


app.post("/enter_lobby", async (c) => {
  const body = await c.req.json();
  const _lobby_id = body.lobby_id, _user_id = body.user_id;
  
  //ADD TO QUEUE
  return c.json({
    message: "added"
  })
})

app.delete("/exit_lobby/:user_id", (c) => {
  const _user_id = c.req.param("user_id");

  //REMOVE FROM QUEUE
  return c.json({
    message: "removed"
  })
})

Deno.serve({port}, app.fetch);
