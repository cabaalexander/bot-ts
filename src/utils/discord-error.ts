import {
  type APIInteractionResponse,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';

import jsonResponse from './json-response';

export default function discordError(content: string) {
  return jsonResponse<APIInteractionResponse>({
    body: {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `💥 ${content}`,
        flags: MessageFlags.Ephemeral,
      },
    },
  });
}
