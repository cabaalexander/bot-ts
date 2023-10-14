import { Hono } from 'hono';

import { HTTP_CODE_BAD_REQUEST } from './config/constants';
import env from './config/env';
import registerCommands from './register';

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

    const res = await app.fetch(req, env);

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
  });

  it('should throw error if no parameter is passed', async () => {
    app.get('/register', registerCommands());

    const res = await app.fetch(req, env);

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

    await app.fetch(req, { ok: 'yes' });
    const expected = [
      'applications/undefined/commands',
      {
        body: [
          { description: 'description for test command', name: 'test-command' },
        ],
        env: { ok: 'yes' },
        method: 'PUT',
      },
    ];

    expect(fetchMock).toHaveBeenLastCalledWith(...expected);
  });
});
