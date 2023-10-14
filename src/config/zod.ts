import { z } from 'zod';

import { slashCommandSchema } from '../lib/slash-command';

export const responseSchema = z.record(z.unknown());

export const responseSchemaError = z.object({
  ok: z.boolean(),
  msg: z.string(),
  errors: z.array(z.unknown()),
});

export const commandsSchema = z.array(slashCommandSchema);

export const libSchema = z.optional(
  z.object({
    fetch: z.function().returns(z.instanceof(Response).promise()),
  }),
);

export const registerCommandsSchema = z.object({
  commands: z.optional(commandsSchema),
  lib: libSchema,
});
