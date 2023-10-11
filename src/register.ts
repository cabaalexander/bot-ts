import {type z} from 'zod';
import {type ContextCustom} from './config/types';
import {commandRegisterSchema} from './lib/slash-command';
import jsonResponse from './utils/json-response';
import {responseSchemaError} from './config/zod';
import {HTTP_CODE_BAD_REQUEST} from './config/constants';
import discordRequest from './utils/discord-request';
import getCommandsUrl from './utils/get-commands-url';

export default function registerCommands(
  commands?: z.infer<typeof commandRegisterSchema>,
) {
  return async (c: ContextCustom) => {
    const commandRegisterParsed = commandRegisterSchema.safeParse(commands);

    if (!commandRegisterParsed.success) {
      return jsonResponse(responseSchemaError, {
        ok: false,
        errors: [commandRegisterParsed.error],
        msg: 'register commands',
      }, {status: HTTP_CODE_BAD_REQUEST});
    }

    const res = await discordRequest(getCommandsUrl(c.env), {
      method: 'PUT',
      body: commands,
      env: c.env,
    });
    const data = await res.json();

    return c.json(data, res.status);
  };
}