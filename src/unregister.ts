import type { z } from 'zod';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NO_CONTENT,
} from './config/constants';
import { type ContextCustom } from './config/types';
import type { registerCommandsSchema } from './config/zod';
import { commandsSchema, responseSchemaError } from './config/zod';
import discordRequest from './utils/discord-request';
import getCommandsUrl from './utils/get-commands-url';
import jsonResponse from './utils/json-response';

export default function unRegisterCommands({
  commands,
  lib,
}: z.infer<typeof registerCommandsSchema> = {}) {
  return async (c: ContextCustom) => {
    // If commands is passed make sure is valid
    if (commands) {
      const commandRegisterParsed = commandsSchema.safeParse(commands);

      if (!commandRegisterParsed.success) {
        return jsonResponse(
          responseSchemaError,
          {
            ok: false,
            errors: [commandRegisterParsed.error],
            msg: 'unregister commands',
          },
          { status: HTTP_CODE_BAD_REQUEST },
        );
      }
    }

    const commandsRes = await (lib?.fetch || discordRequest)(
      getCommandsUrl(c.env),
      {
        env: c.env,
      },
    );
    const commandsData =
      await commandsRes.json<z.infer<typeof commandsSchema>>();

    // If commands parameter is passed filter fetched commands by name
    const filteredCommandsData = commands
      ? commandsData.filter((cmdData) =>
          commands.find((cmd) => cmdData.name === cmd.name),
        )
      : commandsData;

    const commandsReturnData = await Promise.all(
      filteredCommandsData.map(async ({ id = '', name = '' }) => {
        const res = await (lib?.fetch || discordRequest)(
          getCommandsUrl(c.env, id),
          {
            method: 'DELETE',
            env: c.env,
          },
        );

        if (res.status === HTTP_CODE_NO_CONTENT) {
          return { id, name };
        }

        const data = await res.json<z.infer<typeof responseSchemaError>>();

        return data;
      }),
    );

    return c.json(commandsReturnData);
  };
}
