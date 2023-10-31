import { RouteBases } from 'discord-api-types/v10';
import type { z } from 'zod';

import { APP_NAME } from '../config/constants';
import type { libSchema } from '../config/zod';
import { responseSchemaError } from '../config/zod';
import jsonResponse from './json-response';

export default async function discordRequest(
  options: {
    endpoint: string;
    discordToken: string;
    body?: unknown;
    lib?: z.infer<typeof libSchema>;
  } & Omit<RequestInit, 'body'>,
): Promise<Response> {
  const { endpoint, discordToken, body, lib, ...optionsRest } = options;
  const url = `${RouteBases.api}${endpoint}`;
  const bodyString = JSON.stringify(body);
  const fetchOptions = {
    headers: {
      authorization: `Bot ${discordToken}`,
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

  return jsonResponse({
    schema: responseSchemaError,
    body: {
      ok: false,
      msg: 'discord request',
      errors: [data],
    },
    options: { status: res.status },
  });
}
