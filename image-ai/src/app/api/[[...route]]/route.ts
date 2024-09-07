import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import ai from './ai';
import images from './images';
import users from './users';
import test from './test';

// Revert to 'edge' if planning to run on the edge
export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

const routes = app.route('/images', images)
                   .route('/ai', ai)
                   .route('/test', test)
                   .route('/users', users)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;