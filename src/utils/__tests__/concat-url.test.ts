import concatUrl from '../concat-url';

describe('concatUrl', () => {
  it('should trim double slashes from url', () => {
    const url = concatUrl('http://example.com//foo/bar/////');

    expect(url).toBe('http://example.com/foo/bar/');
  });

  it('should concat url parts (without double slashes)', () => {
    const url = concatUrl('http://example.com////', '/foo////', '//bar//////');

    expect(url).toBe('http://example.com/foo/bar/');
  });

  it('should concat url parts with slashes', () => {
    const url = concatUrl('application', 'foo', 'bar');

    expect(url).toBe('application/foo/bar');
  });
});
