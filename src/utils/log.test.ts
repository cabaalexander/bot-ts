import {logError, logInfo} from './log';

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
    expect(log).toBeCalledWith('--[info]', 'hello info');

    logError('hello error');
    expect(error).toBeCalledWith('hello error');
  });
});
