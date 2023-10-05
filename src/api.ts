import {Hono} from 'hono';
import {type Bindings} from './config/types';
import verifyDiscordRequest from './middlewares/verify-discord-request';
import discordPing from './middlewares/discord-ping';

const app = new Hono<{Bindings: Bindings}>();

app.use(verifyDiscordRequest());
app.use(discordPing());

export default app;
