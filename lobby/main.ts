import { Hono } from "hono";
import { connect } from "@db/redis";

const app = new Hono();
const port = 8080;

const redis = await connect({
  hostname: "127.0.0.1",
  port: 6379,
});

app.post("/api/lobby/enter", async (c) => {
  const body = await c.req.json();
  const user_id = body.user_id;
  
  //ADD TO QUEUE
  await redis.rpush("Q_test", user_id);

  return c.json({
    message: `added ${user_id} to queue`
  })
})

app.delete("/api/lobby/exit/:user_id", async (c) => {
  const user_id = c.req.param("user_id");

  //REMOVE FROM QUEUE
  await redis.lrem("Q_test", 0, user_id)

  return c.json({
    message: `removed ${user_id} from the queue`
  })
})

Deno.serve({port}, app.fetch);
