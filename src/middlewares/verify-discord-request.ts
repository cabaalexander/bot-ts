import {type Next, type MiddlewareHandler} from 'hono/dist/types/types';
import {logInfo} from '../utils/log';
import {type ContextCustom} from '../types';
import {verifyKey} from 'discord-interactions';

export default function verifyDiscordRequest(): MiddlewareHandler {
  return async (c: ContextCustom, next: Next) => {
    if (c.req.method.toLocaleLowerCase() !== 'post') {
      await next();
      return;
    }

    const publicKey = c.env.DISCORD_PUBLIC_KEY;
    const signature = c.req.header('x-signature-ed25519') ?? '';
    const timestamp = c.req.header('x-signature-timestamp') ?? '';
    const buf = await c.req.raw.clone().arrayBuffer();

    logInfo('Verifying request');

    const isValidRequest = verifyKey(
      buf,
      signature,
      timestamp,
      publicKey,
    );

    if (!isValidRequest) {
      return new Response('Bad request signature.', {status: 401});
    }

    await next();
  };
}