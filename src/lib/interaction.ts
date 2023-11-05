import type {
  APIGroupDMChannel,
  APIInteraction,
  InteractionType,
} from 'discord-api-types/v10';

import type { ContextCustom } from '../config/types';
import Followup from './followup';

type InteractionJson = Partial<APIInteraction>;

export default class Interaction {
  constructor(
    private readonly interactionJson: InteractionJson,
    private readonly c?: ContextCustom,
  ) {}

  get type(): InteractionType | undefined {
    return this.interactionJson.type;
  }

  get structure(): InteractionJson {
    return this.interactionJson;
  }

  get followUp(): Followup {
    return new Followup(this);
  }

  get lastMessageId(): string {
    if (!this.interactionJson.channel) {
      return '';
    }

    const channel = this.interactionJson.channel as APIGroupDMChannel;

    return channel.last_message_id ?? '';
  }

  defer(callback: (...args: any) => Promise<unknown>): void {
    this.c?.executionCtx.waitUntil(callback(this));
  }
}
