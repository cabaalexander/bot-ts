import type {
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10';
import { RouteBases, Routes } from 'discord-api-types/v10';
import type { z } from 'zod';

import type { libSchema } from '../config/zod';
import type Interaction from './interaction';

export default class Followup {
  constructor(
    private readonly interaction: Interaction,
    private readonly lib?: z.infer<typeof libSchema>,
  ) {}

  reply(message: RESTPostAPIInteractionFollowupJSONBody) {
    return (this.lib?.fetch ?? fetch)(
      `${RouteBases.api}${Routes.webhook(
        this.interaction.structure.application_id ?? '',
        this.interaction.structure.token,
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      },
    );
  }

  get(messageId = this.interaction.lastMessageId) {
    return (this.lib?.fetch ?? fetch)(
      `${RouteBases.api}${Routes.webhookMessage(
        this.interaction.structure.application_id ?? '',
        this.interaction.structure.token ?? '',
        messageId,
      )}`,
      {
        method: 'GET',
      },
    );
  }

  edit(
    message: RESTPatchAPIInteractionFollowupJSONBody,
    messageId = this.interaction.lastMessageId,
  ) {
    return (this.lib?.fetch ?? fetch)(
      `${RouteBases.api}${Routes.webhookMessage(
        this.interaction.structure.application_id ?? '',
        this.interaction.structure.token ?? '',
        messageId,
      )}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      },
    );
  }
}
