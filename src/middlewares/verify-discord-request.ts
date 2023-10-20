/* eslint-disable no-console */

import { verifyKey } from 'discord-interactions';
import { type MiddlewareHandler, type Next } from 'hono/dist/types/types';

import { HTTP_CODE_UNAUTHORIZED } from '../config/constants';
import { type ContextCustom } from '../config/types';
import { responseSchemaError } from '../config/zod';
import jsonResponse from '../utils/json-response';
import { logInfo } from '../utils/log';

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
    const errors: unknown[] = [];

    logInfo('Verifying request', { noLog: Boolean(c.env.NO_LOG) });

    // Catch console.error arguments (verifyKey thing)
    const consoleError = console.error.bind(console);
    console.error = (...args) => errors.push(args.slice(1).join(''));
    const isValidRequest = verifyKey(buf, signature, timestamp, publicKey);
    // Return console.error to its normal form
    console.error = consoleError;

    if (!isValidRequest) {
      // eslint-disable-next-line
      return jsonResponse(
        responseSchemaError,
        {
          ok: false,
          msg: 'verifyKey failed',
          errors,
        },
        { status: HTTP_CODE_UNAUTHORIZED },
      );
    }

    await next();
  };
}
