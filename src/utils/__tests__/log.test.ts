import { logError, logInfo } from '../log';

describe('log', () => {
  let log: jest.SpyInstance;
  let error: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log');
    error = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    log.mockReset();
    error.mockReset();
  });

  it('should log info provided', () => {
    logInfo('hello info');
    expect(log).toHaveBeenCalledWith('--[info]', 'hello info');

    logError('hello error');
    expect(error).toHaveBeenCalledWith('hello error');
  });

  it('should not log', () => {
    logInfo('zup', { noLog: true });
    expect(log).not.toHaveBeenCalled();

    logError('m8', { noLog: true });
    expect(error).not.toHaveBeenCalled();
  });
});
