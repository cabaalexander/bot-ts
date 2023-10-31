import type { APIInteractionResponse } from 'discord-api-types/v10';
import { z } from 'zod';

import type Interaction from './interaction';

type TInteractionCallback = (i: Interaction) => APIInteractionResponse;

export default class SlashCommand {
  private name!: string;

  private description!: string;

  private interactionCallback!: TInteractionCallback;

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public setDescription(description: string): this {
    this.description = description;
    return this;
  }

  public build() {
    return {
      name: this.name,
      description: this.description,
    };
  }

  public handle(interactionCallback: TInteractionCallback): this {
    this.interactionCallback = interactionCallback;
    return this;
  }

  public execute(interaction: Interaction): APIInteractionResponse {
    return this.interactionCallback(interaction);
  }
}

export const slashCommandSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.optional(z.string()),
});
