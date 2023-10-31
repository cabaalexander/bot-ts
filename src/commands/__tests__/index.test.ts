import SlashCommand from '../../lib/slash-command';
import { getCommandsBuild, getCommandsDict } from '..';

describe('commands', () => {
  it('should get the build structure for all commands', () => {
    const commandsBuild = getCommandsBuild();
    const expected = [
      { description: 'Welcome to La villa', name: 'game-start' },
    ];

    expect(commandsBuild).toEqual(expected);
  });

  it('should get commands linked to a property in object', () => {
    const commandsDict = getCommandsDict();
    const oneEntry = Object.entries(commandsDict)[0];

    expect(oneEntry[0]).toBe('game-start');
    expect(oneEntry[1]).toBeInstanceOf(SlashCommand);
  });
});
