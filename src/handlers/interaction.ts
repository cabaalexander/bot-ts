import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import type { Handler } from 'hono';

import { getCommandsDict } from '../commands';
import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NOT_FOUND,
} from '../config/constants';
import type { ContextCustom } from '../config/types';
import { responseSchemaError } from '../config/zod';
import Interaction from '../lib/interaction';
import jsonResponse from '../utils/json-response';

export default function handleInteraction({
  commandsDict = getCommandsDict(),
} = {}): Handler {
  return async (c: ContextCustom) => {
    let data;
    const responseErrorMsg = 'interaction error';

    try {
      data = await c.req.json();
    } catch {
      return jsonResponse({
        schema: responseSchemaError,
        body: {
          ok: false,
          errors: ['not valid json body'],
          msg: responseErrorMsg,
        },
        options: { status: HTTP_CODE_BAD_REQUEST },
      });
    }

    const interaction = new Interaction(data);

    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        const structure =
          interaction.structure as APIApplicationCommandInteraction;

        const triggeredCommand = commandsDict[structure.data.name];

        if (!triggeredCommand) {
          return jsonResponse({
            schema: responseSchemaError,
            body: {
              ok: false,
              errors: ['command not found'],
              msg: responseErrorMsg,
            },
            options: { status: HTTP_CODE_NOT_FOUND },
          });
        }

        const body = triggeredCommand.execute(interaction);

        return jsonResponse({ body });
      }
      default:
        return new Response(null, { status: HTTP_CODE_NOT_FOUND });
    }
  };
}
