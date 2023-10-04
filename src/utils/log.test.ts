import {logError, logInfo} from './log';

const env = getMiniflareBindings();

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
    env.NO_LOG = undefined;

    logInfo('hello info');
    expect(log).toBeCalledWith('--[info]', 'hello info');

    logError('hello error');
    expect(error).toBeCalledWith('hello error');
  });

  it('should not log', () => {
    env.NO_LOG = '1';

    logInfo('zup');
    expect(log).not.toBeCalled();

    logError('m8');
    expect(error).not.toBeCalled();
  });
});
