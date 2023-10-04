import jsonResponse from './json-response';

describe('json-response', () => {
  it('should create a response object of type JSON', async () => {
    const res = jsonResponse({data: 'something'});
    const expectedContentType = 'application/json;charset=UTF-8';
    const data = await res.json();

    expect(res.headers.get('content-type')).toBe(expectedContentType);
    expect(data).toEqual({data: 'something'});
  });

  test.each([
    {payload: 'a', expected: {}},
    {payload: 1, expected: {}},
    {payload: 8.0, expected: {}},
    {payload: true, expected: {}},
  ])(
    'given \'$payload\' as payload it should return empty body',
    async ({payload, expected}) => {
      // @ts-expect-error 2345
      const res = jsonResponse(payload);
      const data = await res.json();

      expect(data).toEqual(expected);
    },
  );
});
