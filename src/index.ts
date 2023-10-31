import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';

import { getCommandsBuild } from './commands';
import { type Bindings } from './config/types';
import handleInteraction from './handlers/interaction';
import discordPing from './middlewares/discord-ping';
import verifyDiscordRequest from './middlewares/verify-discord-request';
import registerCommands from './register';
import unRegisterCommands from './unregister';

const app = new Hono<{ Bindings: Bindings }>();

app.use(verifyDiscordRequest(), discordPing());
app.use('/auth/*', async (c, next) => {
  await basicAuth({
    username: c.env.AUTH_USER,
    password: c.env.AUTH_PASS,
  })(c, next);
});

app.get('/', (c) => c.text('👋 Hello there!')).post(handleInteraction());

app
  .get('/auth/register', registerCommands({ commands: getCommandsBuild() }))
  .delete(unRegisterCommands({ commands: getCommandsBuild() }));

export default app;
