import { HTTP_CODE_NO_CONTENT, HTTP_CODE_OK } from '../../config/constants';
import env from '../../config/env';
import concatUrl from '../concat-url';
import discordRequest from '../discord-request';

describe('discordRequest', () => {
  let testCommandId: string;
  const endpoint = concatUrl(
    'applications',
    env.DISCORD_APPLICATION_ID,
    'commands',
  );

  it('should list commands', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValue(new Response(JSON.stringify({ c: 'yes' })));

    const res = await discordRequest(endpoint, {
      env,
      lib: { fetch: fetchMock },
    });
    expect(res.status).toBe(HTTP_CODE_OK);
  });

  it('should create a command', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValue(new Response(JSON.stringify({ c: 'yes' })));

    const res = await discordRequest(endpoint, {
      method: 'POST',
      body: {
        name: 'test-test',
        description: 'test description',
      },
      env,
      lib: { fetch: fetchMock },
    });
    const expected = [
      'https://discord.com/api/v10/applications/1109330842951630858/commands',
      {
        body: '{"name":"test-test","description":"test description"}',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'bot-ts (bot-ts, 1.0.0)',
          authorization:
            'Bot MTEwOTMzMDg0Mjk1MTYzMDg1OA.GZdDhu.nw_PZ1C6e2TIGxyON8fvLZsckoWaPN_6TtdNY8',
        },
        method: 'POST',
      },
    ];

    expect(res.status).toBeGreaterThan(199);
    expect(res.status).toBeLessThan(300);
    expect(fetchMock).toHaveBeenCalledWith(...expected);
  });

  it('should delete test command', async () => {
    const fetchMock = jest.fn().mockReturnValue(
      new Response(null, {
        status: HTTP_CODE_NO_CONTENT,
      }),
    );

    const res = await discordRequest(concatUrl(endpoint, testCommandId), {
      method: 'DELETE',
      env,
      lib: { fetch: fetchMock },
    });
    const expected = [
      'https://discord.com/api/v10/applications/1109330842951630858/commands/undefined',
      {
        body: undefined,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'bot-ts (bot-ts, 1.0.0)',
          authorization:
            'Bot MTEwOTMzMDg0Mjk1MTYzMDg1OA.GZdDhu.nw_PZ1C6e2TIGxyON8fvLZsckoWaPN_6TtdNY8',
        },
        method: 'DELETE',
      },
    ];

    expect(res.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledWith(...expected);
  });
});
