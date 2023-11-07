import type {
  APIApplicationCommandInteraction,
  APIMessageComponentInteraction,
} from 'discord-api-types/v10';
import { InteractionType } from 'discord-api-types/v10';
import type { Handler } from 'hono';

import { commandsDict } from '../commands';
import { componentsDict } from '../components';
import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NOT_FOUND,
} from '../config/constants';
import type { ContextCustom } from '../config/types';
import { responseSchemaError } from '../config/zod';
import Interaction from '../lib/interaction';
import discordError from '../utils/discord-error';
import jsonResponse from '../utils/json-response';

export default function handleInteraction({
  commands = commandsDict,
  components = componentsDict,
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

    const interaction = new Interaction(data, c);

    switch (interaction.type) {
      case InteractionType.ApplicationCommand: {
        const structure =
          interaction.structure as APIApplicationCommandInteraction;

        const triggeredCommand = commands[structure.data.name];

        if (!triggeredCommand) {
          return discordError('command not triggered');
        }

        const body = await triggeredCommand.execute({ i: interaction, c });

        return jsonResponse({ body });
      }
      case InteractionType.MessageComponent: {
        const structure =
          interaction.structure as APIMessageComponentInteraction;

        const triggeredComponent = components[structure.data.custom_id];

        if (!triggeredComponent) {
          return discordError('component not triggered');
        }

        const body = await triggeredComponent.execute({ i: interaction, c });

        return jsonResponse({ body });
      }
      default:
        return new Response(null, { status: HTTP_CODE_NOT_FOUND });
    }
  };
}
