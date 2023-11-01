import { Hono } from 'hono';
import type { z } from 'zod';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NO_CONTENT,
  HTTP_CODE_OK,
} from '../config/constants';
import type { Bindings } from '../config/types';
import type { commandsSchema } from '../config/zod';
import unRegisterCommands from '../unregister';

describe('unregister', () => {
  let app: Hono;
  const req = new Request('http://localhost/unregister', { method: 'DELETE' });
  const commands: z.infer<typeof commandsSchema> = [
    { id: '321a987b456', name: 'some-command', description: 'b' },
    { id: '81818282', name: 'some-command-two', description: 'd' },
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

    const res = await app.fetch(req);
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

    const res = await app.fetch(req, {
      DISCORD_TOKEN: '7676868',
      DISCORD_APPLICATION_ID: '343434',
    } as Partial<Bindings>);
    const data = await res.json();
    const fetchMockExpected = [
      {
        discordToken: '7676868',
        endpoint: '/applications/343434/commands',
      },
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

    const res = await app.fetch(req, {
      DISCORD_TOKEN: '949494',
      DISCORD_APPLICATION_ID: '32323232',
    } as Partial<Bindings>);

    const data: Array<{ name: string }> = await res.json();
    const expectedData = [{ id: '321a987b456', name: 'some-command' }];
    const expectedMockOne = [
      { discordToken: '949494', endpoint: '/applications/32323232/commands' },
    ];
    const expectedMockTwo = [
      {
        discordToken: '949494',
        endpoint: '/applications/32323232/commands/321a987b456',
        method: 'DELETE',
      },
    ];

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, ...expectedMockOne);
    expect(fetchMock).toHaveBeenNthCalledWith(2, ...expectedMockTwo);
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toEqual(expectedData);
  });

  it('should grab guildId from URL and use it', async () => {
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
    const reqQuery = new Request(`${req.url}?guildId=10385`, {
      method: 'DELETE',
    });

    const res = await app.fetch(reqQuery, {
      DISCORD_TOKEN: '949494',
      DISCORD_APPLICATION_ID: '32323232',
    } as Partial<Bindings>);

    const data: Array<{ name: string }> = await res.json();
    const expectedData = [{ id: '321a987b456', name: 'some-command' }];
    const expectedMockOne = [
      {
        discordToken: '949494',
        endpoint: '/applications/32323232/guilds/10385/commands',
      },
    ];
    const expectedMockTwo = [
      {
        discordToken: '949494',
        endpoint: '/applications/32323232/guilds/10385/commands/321a987b456',
        method: 'DELETE',
      },
    ];

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, ...expectedMockOne);
    expect(fetchMock).toHaveBeenNthCalledWith(2, ...expectedMockTwo);
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toEqual(expectedData);
  });

  it('should override commands parameter if query parameter "all" is passed', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(new Response(JSON.stringify(commands)))
      .mockReturnValue(new Response(null, { status: HTTP_CODE_NO_CONTENT }));

    app.delete(
      '/unregister',
      unRegisterCommands({
        commands: [{ name: 'some-command', description: '' }],
        lib: { fetch: fetchMock },
      }),
    );
    const reqQueryAll = new Request(`${req.url}?all=1`, { method: 'DELETE' });

    const res = await app.fetch(reqQueryAll, {
      DISCORD_TOKEN: '949494',
      DISCORD_APPLICATION_ID: '32323232',
    } as Partial<Bindings>);

    const data: Array<{ name: string }> = await res.json();
    const expectedData = [
      { id: '321a987b456', name: 'some-command' },
      { id: '81818282', name: 'some-command-two' },
    ];
    const expectedMockOne = [
      { discordToken: '949494', endpoint: '/applications/32323232/commands' },
    ];
    const expectedMockTwo = [
      {
        discordToken: '949494',
        endpoint: '/applications/32323232/commands/321a987b456',
        method: 'DELETE',
      },
    ];
    const expectedMockThree = [
      {
        discordToken: '949494',
        endpoint: '/applications/32323232/commands/81818282',
        method: 'DELETE',
      },
    ];

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(1, ...expectedMockOne);
    expect(fetchMock).toHaveBeenNthCalledWith(2, ...expectedMockTwo);
    expect(fetchMock).toHaveBeenNthCalledWith(3, ...expectedMockThree);
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toEqual(expectedData);
  });
});
