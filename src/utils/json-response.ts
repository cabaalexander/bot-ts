import {z} from 'zod';

const dataSchema = z.record(z.unknown());

type Data = z.infer<typeof dataSchema>;

export default function jsonResponse(
  data: Data = {},
  options?: ResponseInit,
): Response {
  const {success} = dataSchema.safeParse(data);

  const payload = success ? data : {};

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    ...options,
  });
}
