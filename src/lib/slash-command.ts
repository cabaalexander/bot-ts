import type { APIInteractionResponse } from 'discord-api-types/v10';
import { z } from 'zod';

import type { ContextCustom } from '../config/types';
import type Interaction from './interaction';

type TInteractionArgs = {
  i: Interaction;
  c: ContextCustom;
};
type TInteractionReturn =
  | Promise<APIInteractionResponse>
  | APIInteractionResponse;
type TInteractionCallback = ({ i, c }: TInteractionArgs) => TInteractionReturn;

export default class SlashCommand {
  constructor(
    private readonly name: string,
    private readonly description: string,
  ) {}

  private interactionCallback!: TInteractionCallback;

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

  public execute(args: TInteractionArgs): TInteractionReturn {
    return this.interactionCallback(args);
  }
}

export const slashCommandSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.optional(z.string()),
});
