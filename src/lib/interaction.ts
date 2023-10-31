import type { APIInteraction, InteractionType } from 'discord-api-types/v10';

export default class Interaction {
  constructor(private readonly interactionJson: APIInteraction) {}

  get type(): InteractionType {
    return this.interactionJson.type;
  }

  get structure(): APIInteraction {
    return this.interactionJson;
  }
}
