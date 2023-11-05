import SlashCommand from '../slash-command';

describe('SlashCommand', () => {
  let slashCommand: SlashCommand;

  beforeAll(() => {
    slashCommand = new SlashCommand('foo', 'bar');
  });

  it('should set name and description', () => {
    const expected = { name: 'foo', description: 'bar' };

    expect(slashCommand.build()).toStrictEqual(expected);
  });

  it('should set and execute the interaction handler', () => {
    const mockFn = jest.fn();
    slashCommand.handle(mockFn);

    const interactionCallbackReflect = Reflect.get(
      slashCommand,
      'interactionCallback',
    );
    // @ts-expect-error 2554
    slashCommand.execute();

    expect(interactionCallbackReflect).toBe(mockFn);
    expect(mockFn).toHaveBeenCalled();
  });
});
