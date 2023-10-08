import {type z} from 'zod';
import {type responseSchemaError} from '../config/zod';

export default function jsonResponse<T>(
  schema: z.Schema<T>,
  data: T,
  options?: ResponseInit,
): Response {
  let payload: unknown;
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    payload = data;
  } else {
    const zodErrors = parsed.error.issues;
    const errorPayload: z.infer<typeof responseSchemaError> = {
      ok: false,
      errors: zodErrors,
      msg: 'zod error',
    };
    payload = errorPayload;
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    ...options,
  });
}
