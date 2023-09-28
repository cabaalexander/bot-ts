import {Hono} from 'hono';

const app = new Hono();

app.get('/', c => c.text('Hello world Hono! (lint) [action]'));

export default app;
