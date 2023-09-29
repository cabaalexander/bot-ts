import {Hono} from 'hono';
import {type Bindings} from './types';

const app = new Hono<{Bindings: Bindings}>();

app.get('/', c => c.text('Hello world Hono! (lint) [action]'));

export default app;
