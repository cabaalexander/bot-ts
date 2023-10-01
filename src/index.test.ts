import app from '.';

describe('app', () => {
  it('GET /', async () => {
    const res = await app.request('http://localhost/');
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('👋 Hello there!');
  });
});
