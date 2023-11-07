import { z } from 'zod';

import SlashEntity from './slash-entity';

export default class SlashCommand extends SlashEntity {
  constructor(
    private readonly name: string,
    private readonly description: string,
  ) {
    super();
  }

  public build() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}

export const slashCommandSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.optional(z.string()),
});
