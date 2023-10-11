import {type MiddlewareHandler, type Next} from 'hono';
import {type ContextCustom} from '../config/types';
import {InteractionResponseType, InteractionType} from 'discord-interactions';
import jsonResponse from '../utils/json-response';
import {logInfo} from '../utils/log';
import {responseSchema} from '../config/zod';

export default function discordPing(): MiddlewareHandler {
  return async (c: ContextCustom, next: Next) => {
    if (c.req.method.toLocaleLowerCase() !== 'post') {
      await next();
      return;
    }

    const {type} = await c.req.json<{type: InteractionType}>();

    if (type === InteractionType.PING) {
      logInfo('Handling Ping request. Pong!', {env: c.env});

      return jsonResponse(responseSchema, {
        type: InteractionResponseType.PONG,
      });
    }

    await next();
  };
}

