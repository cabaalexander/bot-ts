import {Hono} from 'hono';
import verifyDiscordRequest from './verify-discord-request';
import env from '../config/env';
import {HTTP_CODE_OK, HTTP_CODE_UNAUTHORIZED} from '../config/constants';

describe('verify-discord-request', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.use(verifyDiscordRequest());
  });

  it('should exit if method is not post', async () => {
    app.get('/', c => c.text('c'));

    const req = new Request('http://localhost/');
    const res = await app.request(req);

    expect(res).not.toBeNull();
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(await res.text()).toBe('c');
  });

  it('should fail verification process', async () => {
    app.post('/');

    const xSignatureEd25519 = [
      '4197b08f157649fe0bd35d72cbd5b496686828b1bc2449a42d6a02f8361d988c357682',
      'cb67e6af8c10ba0ef3fb397f076142ac763b988f953481786fd52d4b01',
    ].join('');

    const req = new Request('http://localhost/', {
      method: 'POST',
      headers: {
        'x-signature-ed25519': xSignatureEd25519,
        'x-signature-timestamp': '1696256136',
      },
      body: JSON.stringify({data: 'test data'}),
    });
    const res = await app.fetch(req, env);
    const data = await res.json<{ok: boolean; msg: string}>();

    expect(res.status).toBe(HTTP_CODE_UNAUTHORIZED);
    expect(data.ok).toBe(false);
    expect(data.msg).toBe('verifyKey failed');
  });
});
