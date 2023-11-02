import { Buffer } from 'buffer';
import { Hono } from 'hono';

import { HTTP_CODE_OK } from '../../config/constants';
import type { Bindings } from '../../config/types';
import verifyDiscordRequest from '../verify-discord-request';

describe('verify-discord-request', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  it('should exit if method is not post', async () => {
    app.use(verifyDiscordRequest());
    app.get('/', (c) => c.text('c'));

    const req = new Request('http://localhost/');
    const res = await app.request(req);

    expect(res).not.toBeNull();
    expect(res.status).toBe(HTTP_CODE_OK);
    expect(await res.text()).toBe('c');
  });

  it('should verify the request', async () => {
    const verifyMock = jest.fn();
    verifyMock.mockReturnValueOnce(true);

    app.use(verifyDiscordRequest({ lib: { verify: verifyMock } }));
    app.post('/');

    const publicKey = '222';
    const xSignatureEd25519 = '3838292';
    const xTimestamp = '1696256136';
    const body = JSON.stringify({ data: 'test data' });
    const req = new Request('http://localhost/', {
      method: 'POST',
      headers: {
        'x-signature-ed25519': xSignatureEd25519,
        'x-signature-timestamp': xTimestamp,
      },
      body,
    });

    const env = { DISCORD_PUBLIC_KEY: publicKey } as Partial<Bindings>;
    await app.fetch(req, env);
    // const data = await res.json<{ ok: boolean; msg: string }>();
    const verifyExpected = [
      Buffer.from(xTimestamp + body),
      Buffer.from(xSignatureEd25519, 'hex'),
      Buffer.from(publicKey, 'hex'),
    ];

    expect(verifyMock).toHaveBeenCalledWith(...verifyExpected);
  });

  it('should handle fail', async () => {
    const verifyMock = jest.fn();
    verifyMock.mockReturnValueOnce(false);

    app.use(verifyDiscordRequest({ lib: { verify: verifyMock } }));
    app.post('/');

    const body = JSON.stringify({ data: 'test data' });
    const req = new Request('http://localhost/', {
      method: 'POST',
      body,
    });

    const env = { DISCORD_PUBLIC_KEY: '' } as Partial<Bindings>;
    const res = await app.fetch(req, env);
    const data = await res.json();
    const dataExpected = {
      errors: ['verifyKey failed'],
      msg: 'verifyDiscord',
      ok: false,
    };

    expect(data).toEqual(dataExpected);
  });
});
