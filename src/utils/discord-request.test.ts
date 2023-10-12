import env from '../config/env';
import concatUrl from './concat-url';
import discordRequest from './discord-request';

// @TODO: maybe mock call to discord API here too
describe.skip('discordRequest', () => {
  let endpoint: string;
  let testCommandId: string;

  beforeAll(() => {
    endpoint = concatUrl(
      'applications',
      env.DISCORD_APPLICATION_ID,
      'commands',
    );
  });

  it('should list commands', async () => {
    const res = await discordRequest(endpoint, { env });
    expect(res.status).toBe(200);
  });

  it('should create a command', async () => {
    const res = await discordRequest(endpoint, {
      method: 'POST',
      body: {
        name: 'test-test',
        description: 'test description',
      },
      env,
    });
    const data: { id: string } = await res.json();

    testCommandId = data.id;

    expect(res.status).toBeGreaterThan(199);
    expect(res.status).toBeLessThan(300);
  });

  it('should delete test command', async () => {
    const res = await discordRequest(concatUrl(endpoint, testCommandId), {
      method: 'DELETE',
      env,
    });

    expect(res.status).toBe(204);
  });
});
