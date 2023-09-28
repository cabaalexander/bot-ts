import {Hono} from 'hono';

const app = new Hono();

app.get('/', c => c.text('Hello world Hono!'));

export default app;
