import {Hono} from 'hono';
import {type Bindings} from './config/types';
import verifyDiscordRequest from './middlewares/verify-discord-request';
import discordPing from './middlewares/discord-ping';
import registerCommands from './register';
import {basicAuth} from 'hono/basic-auth';
import unRegisterCommands from './unregister';

const app = new Hono<{Bindings: Bindings}>();

app.use(verifyDiscordRequest(), discordPing());
app.use(
  '/auth/*',
  async (c, next) => {
    await basicAuth({
      username: c.env.AUTH_USER,
      password: c.env.AUTH_PASS,
    })(c, next);
  },
);

app.get('/', c => c.text('👋 Hello there!'));

app
  .get('/auth/register', registerCommands())
  .delete(unRegisterCommands());

app.notFound(c => c.text('Not found path m8. :('));

export default app;
