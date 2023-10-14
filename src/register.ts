import type { z } from 'zod';

import { HTTP_CODE_BAD_REQUEST } from './config/constants';
import { type ContextCustom } from './config/types';
import type { registerCommandsSchema } from './config/zod';
import { commandsSchema, responseSchemaError } from './config/zod';
import discordRequest from './utils/discord-request';
import getCommandsUrl from './utils/get-commands-url';
import jsonResponse from './utils/json-response';

export default function registerCommands({
  commands,
  lib,
}: z.infer<typeof registerCommandsSchema> = {}) {
  return async (c: ContextCustom) => {
    const commandRegisterParsed = commandsSchema.safeParse(commands);

    if (!commandRegisterParsed.success) {
      return jsonResponse(
        responseSchemaError,
        {
          ok: false,
          errors: [commandRegisterParsed.error],
          msg: 'register commands',
        },
        { status: HTTP_CODE_BAD_REQUEST },
      );
    }

    const res = await (lib?.fetch || discordRequest)(getCommandsUrl(c.env), {
      method: 'PUT',
      body: commands,
      env: c.env,
    });
    const data = await res.json();

    return c.json(data, res.status);
  };
}
