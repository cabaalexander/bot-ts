import { responseSchema } from '../../config/zod';
import jsonResponse from '../json-response';

// Little utility function to construct test table
function getZodError(props: {
  code?: string;
  expected?: string;
  message?: string;
  path?: unknown[];
  received?: string;
}) {
  const error = {
    code: 'invalid_type',
    expected: 'object',
    message: 'Expected object, received string',
    path: [],
    received: 'string',
  };
  return {
    errors: [{ ...error, ...props }],
    ok: false,
    msg: 'zod error',
  };
}

describe('json-response', () => {
  it('should create a response object of type JSON', async () => {
    const res = jsonResponse(responseSchema, { data: 'something' });
    const expectedContentType = 'application/json;charset=UTF-8';
    const data = await res.json();

    expect(res.headers.get('content-type')).toBe(expectedContentType);
    expect(data).toEqual({ data: 'something' });
  });

  test.each([
    {
      payload: 'a',
      expected: getZodError({
        message: 'Expected object, received string',
        received: 'string',
      }),
    },
    {
      payload: 1,
      expected: getZodError({
        message: 'Expected object, received number',
        received: 'number',
      }),
    },
    {
      payload: 8.0,
      expected: getZodError({
        message: 'Expected object, received number',
        received: 'number',
      }),
    },
    {
      payload: true,
      expected: getZodError({
        message: 'Expected object, received boolean',
        received: 'boolean',
      }),
    },
  ])(
    "given '$payload' as payload it should return empty body",
    async ({ payload, expected }) => {
      // @ts-expect-error 2345
      const res = jsonResponse(responseSchema, payload);
      const data = await res.json();

      expect(data).toEqual(expected);
    },
  );
});
