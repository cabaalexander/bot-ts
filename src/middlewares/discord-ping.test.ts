import {Hono} from 'hono';
import discordPing from './discord-ping';
import {InteractionResponseType, InteractionType} from 'discord-interactions';

describe('discord-ping', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use(discordPing());
  });

  it('should exit if method is not post', async () => {
    app.get('/', c => c.text('hello m8'));

    const req = new Request('http://localhost/');
    const res = await app.request(req);

    expect(res).not.toBeNull();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('hello m8');
  });

  it('should respond ping with pong', async () => {
    app.post('/');

    const req = new Request('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({
        type: InteractionType.PING,
      }),
    });
    const res = await app.request(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({type: InteractionResponseType.PONG});
  });

  it('should handle non ping requests', async () => {
    app.post('/', c => c.json({data: 'test success'}));

    const req = new Request('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await app.request(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({data: 'test success'});
  });
});
