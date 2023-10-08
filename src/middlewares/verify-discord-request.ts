/* eslint-disable no-console */

import {type Next, type MiddlewareHandler} from 'hono/dist/types/types';
import {logInfo} from '../utils/log';
import {type ContextCustom} from '../config/types';
import {verifyKey} from 'discord-interactions';
import jsonResponse from '../utils/json-response';
import {responseSchemaError} from '../config/zod';

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

    logInfo('Verifying request');

    // Catch console.error arguments (verifyKey thing)
    const consoleError = console.error.bind(console);
    console.error = (...args) => errors.push(args.slice(1).join(''));
    const isValidRequest = verifyKey(
      buf,
      signature,
      timestamp,
      publicKey,
    );
    // Return console.error to its normal form
    console.error = consoleError;

    if (!isValidRequest) {
      return jsonResponse(responseSchemaError, {
        ok: false,
        msg: 'verifyKey failed',
        errors,
      }, {status: 401});
    }

    await next();
  };
}
