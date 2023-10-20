import { HTTP_CODE_NO_CONTENT, HTTP_CODE_OK } from '../../config/constants';
import discordRequest from '../discord-request';
import getCommandsUrl from '../get-commands-url';

describe('discordRequest', () => {
  const endpoint = getCommandsUrl({ applicationId: '21212121' });

  it('should list commands', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValue(new Response(JSON.stringify({ c: 'yes' })));

    const res = await discordRequest({
      endpoint,
      discordToken: '6565656565',
      lib: { fetch: fetchMock },
    });
    const fetchMockExpected = [
      'https://discord.com/api/v10/applications/21212121/commands',
      {
        body: undefined,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'bot-ts (bot-ts, 1.0.0)',
          authorization: 'Bot 6565656565',
        },
      },
    ];

    expect(res.status).toBe(HTTP_CODE_OK);
    expect(fetchMock).toHaveBeenCalledWith(...fetchMockExpected);
  });

  it('should create a command', async () => {
    const fetchMock = jest
      .fn()
      .mockReturnValue(new Response(JSON.stringify({ c: 'yes' })));

    const res = await discordRequest({
      endpoint,
      method: 'POST',
      body: {
        name: 'test-test',
        description: 'test description',
      },
      discordToken: '8686868',
      lib: { fetch: fetchMock },
    });
    const expected = [
      'https://discord.com/api/v10/applications/21212121/commands',
      {
        body: '{"name":"test-test","description":"test description"}',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'bot-ts (bot-ts, 1.0.0)',
          authorization: 'Bot 8686868',
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

    const res = await discordRequest({
      endpoint: getCommandsUrl({
        applicationId: '767676',
        commandId: '2312385',
      }),
      method: 'DELETE',
      discordToken: '98766340',
      lib: { fetch: fetchMock },
    });
    const expected = [
      'https://discord.com/api/v10/applications/767676/commands/2312385',
      {
        body: undefined,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': 'bot-ts (bot-ts, 1.0.0)',
          authorization: 'Bot 98766340',
        },
        method: 'DELETE',
      },
    ];

    expect(res.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledWith(...expected);
  });
});
