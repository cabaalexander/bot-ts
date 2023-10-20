import { Hono } from 'hono';

import { HTTP_CODE_BAD_REQUEST } from '../config/constants';
import type { Bindings } from '../config/types';
import registerCommands from '../register';

describe('register', () => {
  let app: Hono;
  const req = new Request('http://localhost/register');
  const testCommand = [
    {
      name: 'test-command',
      description: 'description for test command',
    },
  ];

  beforeEach(() => {
    app = new Hono();
  });

  it('should fail registering commands', async () => {
    app.get(
      '/register',
      registerCommands({
        // @ts-ignore
        commands: [{ name: 'foobar' }],
      }),
    );

    const res = await app.fetch(req);

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
  });

  it('should throw error if no parameter is passed', async () => {
    app.get('/register', registerCommands());

    const res = await app.fetch(req);

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
  });

  it('should register commands', async () => {
    const fetchMock = jest.fn().mockReturnValue(new Response('{}'));

    app.get(
      '/register',
      registerCommands({
        commands: testCommand,
        lib: { fetch: fetchMock },
      }),
    );

    await app.fetch(req, {
      DISCORD_APPLICATION_ID: '875394',
      DISCORD_TOKEN: '1938485',
    } as Partial<Bindings>);

    const expected = [
      {
        endpoint: '/applications/875394/commands',
        discordToken: '1938485',
        body: [
          { description: 'description for test command', name: 'test-command' },
        ],
        method: 'PUT',
      },
    ];

    expect(fetchMock).toHaveBeenLastCalledWith(...expected);
  });

  it('should grab the GUILD_ID from param', async () => {
    const fetchMock = jest.fn().mockReturnValue(new Response('{}'));

    app.get(
      '/register',
      registerCommands({
        commands: testCommand,
        lib: { fetch: fetchMock },
      }),
    );

    const reqQuery = new Request(`${req.url}?guildId=321456987`);

    await app.fetch(reqQuery, {
      DISCORD_TOKEN: '1924949',
      DISCORD_APPLICATION_ID: '0989838812',
    } as Partial<Bindings>);

    const expected = [
      {
        body: [
          { description: 'description for test command', name: 'test-command' },
        ],
        discordToken: '1924949',
        endpoint: '/applications/0989838812/guilds/321456987/commands',
        method: 'PUT',
      },
    ];

    expect(fetchMock).toHaveBeenLastCalledWith(...expected);
  });
});
