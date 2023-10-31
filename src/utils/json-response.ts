import { type z } from 'zod';

import { type responseSchemaError } from '../config/zod';

export default function jsonResponse<T>({
  schema,
  body,
  options,
}: {
  schema?: z.Schema<T>;
  body: T;
  options?: ResponseInit;
}): Response {
  let payload: unknown;

  if (schema) {
    const parsed = schema.safeParse(body);

    if (parsed.success) {
      payload = body;
    } else {
      const zodErrors = parsed.error.issues;
      const errorPayload: z.infer<typeof responseSchemaError> = {
        ok: false,
        msg: 'zod error',
        errors: zodErrors,
      };
      payload = errorPayload;
    }
  } else {
    payload = body;
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    ...options,
  });
}
