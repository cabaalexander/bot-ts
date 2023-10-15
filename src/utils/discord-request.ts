import type { z } from 'zod';

import { APP_NAME, DISCORD_API_ROOT } from '../config/constants';
import { type Bindings } from '../config/types';
import type { libSchema } from '../config/zod';
import { responseSchemaError } from '../config/zod';
import jsonResponse from './json-response';

export default async function discordRequest(
  endpoint: string,
  options: {
    body?: unknown;
    env: Bindings;
    lib?: z.infer<typeof libSchema>;
  } & Omit<RequestInit, 'body'>,
): Promise<Response> {
  const url = `${DISCORD_API_ROOT}${endpoint}`;
  const { body, env, lib, ...optionsRest } = options;
  const bodyString = JSON.stringify(body);
  const fetchOptions = {
    headers: {
      authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': `${APP_NAME} (${APP_NAME}, 1.0.0)`,
    },
    body: bodyString,
    ...optionsRest,
  };

  const res = await (lib?.fetch || fetch)(url, fetchOptions);

  if (res.ok) {
    return res;
  }

  const data = await res.json();

  return jsonResponse(
    responseSchemaError,
    {
      ok: false,
      msg: 'discord request',
      errors: [data],
    },
    { status: res.status },
  );
}
