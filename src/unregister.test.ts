import { Hono } from 'hono';
import type { z } from 'zod';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NO_CONTENT,
  HTTP_CODE_OK,
} from './config/constants';
import env from './config/env';
import type { commandsSchema } from './config/zod';
import unRegisterCommands from './unregister';

describe('unregister', () => {
  let app: Hono;
  const req = new Request('http://localhost/unregister', { method: 'DELETE' });
  const commands: z.infer<typeof commandsSchema> = [
    { id: '321a987b456', name: 'some-command', description: 'b' },
  ];

  beforeEach(() => {
    app = new Hono();
  });

  it('should fail on command invalid by zod', async () => {
    const fetchMock = jest.fn();

    app.delete(
      '/unregister',
      unRegisterCommands({
        // @ts-expect-error 2741
        commands: [{ name: 'foobar' }],
        lib: { fetch: fetchMock },
      }),
    );

    const res = await app.fetch(req, env);
    const data = await res.json();
    const expected = {
      ok: false,
      errors: [
        {
          issues: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: [0, 'description'],
              message: 'Required',
            },
          ],
          name: 'ZodError',
        },
      ],
      msg: 'unregister commands',
    };

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
    expect(data).toEqual(expected);
  });

  it('should fail because no commands are found', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(new Response(JSON.stringify(commands)))
      .mockReturnValueOnce(new Response(JSON.stringify({})));

    app.delete(
      '/unregister',
      unRegisterCommands({
        commands: [{ name: 'not-found', description: '' }],
        lib: { fetch: fetchMock },
      }),
    );

    const res = await app.fetch(req, { ok: 'yes' });
    const data = await res.json();
    const fetchMockExpected = [
      'applications/undefined/commands',
      { env: { ok: 'yes' } },
    ];
    const dataExpected = {
      errors: ['no commands to unregister were found'],
      msg: 'unregister commands',
      ok: false,
    };

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenNthCalledWith(1, ...fetchMockExpected);
    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
    expect(data).toEqual(dataExpected);
  });

  it('should unregister commands', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(new Response(JSON.stringify(commands)))
      .mockReturnValueOnce(
        new Response(null, { status: HTTP_CODE_NO_CONTENT }),
      );

    app.delete(
      '/unregister',
      unRegisterCommands({
        commands: [{ name: 'some-command', description: '' }],
        lib: { fetch: fetchMock },
      }),
    );

    const res = await app.fetch(req, { ok: 'yes' });
    const data: Array<{ name: string }> = await res.json();
    const expectedData = [{ id: '321a987b456', name: 'some-command' }];
    const expectedMockOne = [
      'applications/undefined/commands',
      { env: { ok: 'yes' } },
    ];
    const expectedMockTwo = [
      'applications/undefined/commands/321a987b456',
      { env: { ok: 'yes' }, method: 'DELETE' },
    ];

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, ...expectedMockOne);
    expect(fetchMock).toHaveBeenNthCalledWith(2, ...expectedMockTwo);
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toEqual(expectedData);
  });
});
