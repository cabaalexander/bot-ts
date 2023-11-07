import type { z } from 'zod';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NO_CONTENT,
} from './config/constants';
import type { ContextCustom, TSlashBuild } from './config/types';
import type { libSchema } from './config/zod';
import { commandsSchema, responseSchemaError } from './config/zod';
import discordRequest from './utils/discord-request';
import getCommandsUrl from './utils/get-commands-url';
import jsonResponse from './utils/json-response';

export default function unRegisterCommands({
  commands,
  lib,
}: {
  commands?: Array<TSlashBuild>;
  lib?: z.infer<typeof libSchema>;
} = {}) {
  return async (c: ContextCustom) => {
    const guildId = c.req.query('guildId');
    const overrideCommands = c.req.query('all');
    const shouldUseCommands = commands && !overrideCommands;

    // If commands is passed make sure is valid
    if (shouldUseCommands) {
      const commandRegisterParsed = commandsSchema.safeParse(commands);

      if (!commandRegisterParsed.success) {
        return jsonResponse({
          schema: responseSchemaError,
          body: {
            ok: false,
            msg: 'unregister commands',
            errors: [commandRegisterParsed.error],
          },
          options: { status: HTTP_CODE_BAD_REQUEST },
        });
      }
    }

    const commandsRes = await (lib?.fetch || discordRequest)({
      endpoint: getCommandsUrl({
        applicationId: c.env.DISCORD_APPLICATION_ID,
        guildId,
      }),
      discordToken: c.env.DISCORD_TOKEN,
    });
    const commandsData =
      await commandsRes.json<z.infer<typeof commandsSchema>>();

    // If commands parameter is passed filter fetched commands by name
    const filteredCommandsData = shouldUseCommands
      ? commandsData.filter((cmdData) =>
          commands.find((cmd) => {
            if ('name' in cmd) {
              return cmdData.name === cmd.name;
            }
            return null;
          }),
        )
      : commandsData;

    const commandsReturnData = await Promise.all(
      filteredCommandsData.map(async ({ id = '', name = '' }) => {
        const res = await (lib?.fetch || discordRequest)({
          endpoint: getCommandsUrl({
            applicationId: c.env.DISCORD_APPLICATION_ID,
            guildId,
            commandId: id,
          }),
          method: 'DELETE',
          discordToken: c.env.DISCORD_TOKEN,
        });

        if (res.status === HTTP_CODE_NO_CONTENT) {
          return { id, name };
        }

        const data = await res.json<z.infer<typeof responseSchemaError>>();

        return data;
      }),
    );

    if (commandsReturnData.length) {
      return c.json(commandsReturnData);
    }

    return jsonResponse({
      schema: responseSchemaError,
      body: {
        ok: false,
        msg: 'unregister commands',
        errors: ['no commands to unregister were found'],
      },
      options: { status: HTTP_CODE_BAD_REQUEST },
    });
  };
}
