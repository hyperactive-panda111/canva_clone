import { verifyAuth } from '@hono/auth-js';
import { Hono } from 'hono';

const app = new Hono()
    .get('/', verifyAuth(), async (c) => {
        const auth = c.get('authUser');
        return c.json({ token: auth.token })
    });

export default app;