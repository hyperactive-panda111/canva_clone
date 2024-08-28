import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => {
    return c.json({ user: "GET ON UP" });
  })
  .get("/:name", (c) => {
    const param = c.req.param("name");
    return c.json({ userName: param }, 200);
  });

export default app;
