import {z} from 'zod';

export default class SlashCommand {
  private name!: string;

  private description!: string;

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setDescription(description: string) {
    this.description = description;
    return this;
  }

  public build() {
    return {
      name: this.name,
      description: this.description,
    };
  }
}

export const commandRegisterSchema = z.array(z.object({
  name: z.string(),
  description: z.string(),
  id: z.optional(z.string()),
}));
