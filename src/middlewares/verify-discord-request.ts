/* eslint-disable no-console */

import { Buffer } from 'buffer';
import { type MiddlewareHandler, type Next } from 'hono/dist/types/types';
import { sign } from 'tweetnacl';

import { HTTP_CODE_UNAUTHORIZED } from '../config/constants';
import { type ContextCustom } from '../config/types';
import { responseSchemaError } from '../config/zod';
import jsonResponse from '../utils/json-response';

export default function verifyDiscordRequest({
  lib: { verify = sign.detached.verify } = {},
} = {}): MiddlewareHandler {
  return async (c: ContextCustom, next: Next) => {
    if (c.req.method.toLocaleLowerCase() !== 'post') {
      await next();
      return;
    }

    const publicKey = c.env.DISCORD_PUBLIC_KEY;
    const signature = c.req.header('x-signature-ed25519') ?? '';
    const timestamp = c.req.header('x-signature-timestamp') ?? '';
    const body = await c.req.raw.clone().text();

    const isVerified = verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex'),
    );

    if (!isVerified) {
      // eslint-disable-next-line
      return jsonResponse({
        schema: responseSchemaError,
        body: {
          ok: false,
          msg: 'verifyDiscord',
          errors: ['verifyKey failed'],
        },
        options: { status: HTTP_CODE_UNAUTHORIZED },
      });
    }

    await next();
  };
}
