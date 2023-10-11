import {Hono} from 'hono';
import unRegisterCommands from './unregister';
import env from './config/env';
import registerCommands from './register';
import {HTTP_CODE_BAD_REQUEST, HTTP_CODE_OK} from './config/constants';

// @TODO: need to mock 'discordRequest' function so it does not hit discord API
describe.skip('unregister', () => {
  let app = new Hono();
  const req = new Request('http://localhost/unregister', {
    method: 'DELETE',
  });
  const testCommand = [{
    name: 'testcommand-unregister',
    description: 'unregister test suit',
  }];

  beforeAll(async () => {
    app.get('/register', registerCommands(testCommand));
    const req = new Request('http://localhost/register');
    await app.fetch(req, env);
  });

  beforeEach(() => {
    app = new Hono();
  });

  it('should fail because no commands are found', async () => {
    app.delete(
      '/unregister',
      unRegisterCommands([{name: 'not-found', description: ''}]),
    );

    const res = await app.fetch(req, env);
    const data = await res.json();

    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toStrictEqual([]);
  });

  it('should unregister commands', async () => {
    app.delete('/unregister', unRegisterCommands());

    const res = await app.fetch(req, env);
    const data: Array<{name: string}> = await res.json();

    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data[0].name).toBe('testcommand-unregister');
  });

  it('should fail on command invalid by zod', async () => {
    // @ts-expect-error 2741
    app.delete('/unregister', unRegisterCommands([{name: 'foobar'}]));

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
              path: [
                0,
                'description',
              ],
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
});
