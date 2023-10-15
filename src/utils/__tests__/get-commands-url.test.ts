import env from '../../config/env';
import getCommandsUrl from '../get-commands-url';

describe('getCommandsUrl', () => {
  it('should log root commands url', () => {
    const data = getCommandsUrl(env);
    expect(data).toBe('applications/1109330842951630858/commands');
  });

  it('should concat any parameter to the commands root url', () => {
    const data = getCommandsUrl(env, 'foo', 'bar');
    expect(data).toBe('applications/1109330842951630858/commands/foo/bar');
  });
});
