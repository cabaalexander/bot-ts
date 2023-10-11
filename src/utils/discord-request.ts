import {APP_NAME, DISCORD_API_ROOT} from '../config/constants';
import {type Bindings} from '../config/types';
import {responseSchemaError} from '../config/zod';
import jsonResponse from './json-response';

export default async function discordRequest(
  endpoint: string,
  options: {
    body?: unknown;
    env: Bindings;
  } & Omit<RequestInit, 'body'>,
): Promise<Response> {
  const url = `${DISCORD_API_ROOT}${endpoint}`;
  const {body, env, ...optionsRest} = options;
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

  const res = await fetch(url, fetchOptions);

  if (res.ok) {
    return res;
  }

  const data = await res.json();

  return jsonResponse(responseSchemaError, {
    ok: false,
    errors: [data],
    msg: 'discord request',
  }, {status: res.status});
}
