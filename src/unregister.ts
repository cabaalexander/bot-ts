import {type z} from 'zod';
import {type ContextCustom} from './config/types';
import {commandRegisterSchema} from './lib/slash-command';
import jsonResponse from './utils/json-response';
import {responseSchemaError} from './config/zod';
import {
  HTTP_CODE_NO_CONTENT,
  HTTP_CODE_BAD_REQUEST,
} from './config/constants';
import discordRequest from './utils/discord-request';
import getCommandsUrl from './utils/get-commands-url';

type Commands = z.infer<typeof commandRegisterSchema>;

export default function unRegisterCommands(
  commands?: Commands,
) {
  return async (c: ContextCustom) => {
    // If commands is passed make sure is valid
    if (commands) {
      const commandRegisterParsed = commandRegisterSchema.safeParse(commands);

      if (!commandRegisterParsed.success) {
        return jsonResponse(responseSchemaError, {
          ok: false,
          errors: [commandRegisterParsed.error],
          msg: 'unregister commands',
        }, {status: HTTP_CODE_BAD_REQUEST});
      }
    }

    const commandsRes = await discordRequest(getCommandsUrl(c.env), {
      env: c.env,
    });
    const commandsData = await commandsRes.json<Commands>();

    // If commands parameter is passed filter fetched commands by name
    const filteredCommandsData = commands
      ? commandsData.filter(c => commands.find(d => c.name === d.name))
      : commandsData;

    const commandsReturnData = await Promise.all(
      filteredCommandsData
        .map(async ({id = '', name = ''}) => {
          const res = await discordRequest(
            getCommandsUrl(c.env, id),
            {
              method: 'DELETE',
              env: c.env,
            },
          );

          if (res.status === HTTP_CODE_NO_CONTENT) {
            return {id, name};
          }

          const data = await res.json<z.infer<typeof responseSchemaError>>();

          return data;
        }),
    );

    return c.json(commandsReturnData);
  };
}
