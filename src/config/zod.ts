import {z} from 'zod';

export const responseSchema = z.record(z.unknown());

export const responseSchemaError = z.object({
  ok: z.boolean(),
  msg: z.string(),
  errors: z.array(z.unknown()),
});
