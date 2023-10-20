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
    const guildId = c.req.query('guildId');

    if (!commandRegisterParsed.success) {
      return jsonResponse(
        responseSchemaError,
        {
          ok: false,
          msg: 'register commands',
          errors: [commandRegisterParsed.error],
        },
        { status: HTTP_CODE_BAD_REQUEST },
      );
    }

    const res = await (lib?.fetch || discordRequest)({
      endpoint: getCommandsUrl({
        applicationId: c.env.DISCORD_APPLICATION_ID,
        guildId,
      }),
      method: 'PUT',
      body: commands,
      discordToken: c.env.DISCORD_TOKEN,
    });
    const data = await res.json();

    return c.json(data, res.status);
  };
}
