import { Hono } from 'hono';

const app = new Hono()
    .get('/', async (c) => {
        return c.json({ success: true })
    });

export default app;