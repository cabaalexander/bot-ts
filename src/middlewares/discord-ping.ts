import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { type MiddlewareHandler, type Next } from 'hono';

import { type ContextCustom } from '../config/types';
import { responseSchema } from '../config/zod';
import jsonResponse from '../utils/json-response';
import { logInfo } from '../utils/log';

export default function discordPing(): MiddlewareHandler {
  return async (c: ContextCustom, next: Next) => {
    if (c.req.method.toLocaleLowerCase() !== 'post') {
      await next();
      return;
    }

    const { type } = await c.req.json<{ type: InteractionType }>();

    if (type === InteractionType.PING) {
      logInfo('Handling Ping request. Pong!', { noLog: Boolean(c.env.NO_LOG) });

      // eslint-disable-next-line
      return jsonResponse(responseSchema, {
        type: InteractionResponseType.PONG,
      });
    }

    await next();
  };
}
