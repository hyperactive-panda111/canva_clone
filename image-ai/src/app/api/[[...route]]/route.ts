import { Context, Hono } from 'hono';
import { handle } from 'hono/vercel';
import { AuthConfig, initAuthConfig } from '@hono/auth-js'
import authConfig from '@/auth.config';

import ai from './ai';
import images from './images';
import users from './users';
import projects from './projects';
import subscriptions from './subscriptions';

// Revert to 'edge' if planning to run on the edge
export const runtime = 'nodejs';

function getAuthConfig(c: Context): AuthConfig {
    return {
        secret: c.env.AUTH_SECRET,
        ...authConfig,
    }
}; 

const app = new Hono().basePath('/api');
app.use('*', initAuthConfig(getAuthConfig));

const routes = app.route('/images', images)
                   .route('/projects', projects)
                   .route('/ai', ai)
                   .route('/subscriptions', subscriptions)
                   .route('/users', users);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;