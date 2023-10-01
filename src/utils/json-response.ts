export default function jsonResponse(
  data: Record<string, unknown>,
  options?: ResponseInit,
) {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    ...options,
  });
}
