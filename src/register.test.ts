import {Hono} from 'hono';
import registerCommands from './register';
import env from './config/env';
import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_OK,
} from './config/constants';
import discordRequest from './utils/discord-request';
import concatUrl from './utils/concat-url';
import getCommandsUrl from './utils/get-commands-url';

// @TODO: need to mock 'discordRequest' function so it does not hit discord API
describe.skip('register', () => {
  const testCommand = [{
    name: 'test-command',
    description: 'description for test command',
  }];
  const req = new Request('http://localhost/register');
  let app: Hono;
  let commands: Array<{id: string}>;

  beforeEach(() => {
    app = new Hono();
  });

  afterAll(() => {
    commands?.forEach(async c => {
      if (!c.id) {
        return;
      }

      await discordRequest(
        concatUrl(getCommandsUrl(env), c.id),
        {
          env,
          method: 'DELETE',
        },
      );
    });
  });

  it('should fail registering commands commands', async () => {
    // @ts-expect-error 2741
    app.get('/register', registerCommands([{name: 'foobar'}]));

    const res = await app.fetch(req, env);

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
  });

  it('should register commands', async () => {
    app.get('/register', registerCommands(testCommand));

    const res = await app.fetch(req, env);

    // Save commands for cleanup (if OK)
    if (res.status === HTTP_CODE_OK) {
      const data = await res.json();
      commands = data as [{id: string}];
    }

    expect(res.status).toBe(HTTP_CODE_OK);
  });
});
