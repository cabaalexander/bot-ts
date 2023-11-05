import SlashCommand from '../../lib/slash-command';
import { getCommandsBuild, getCommandsDict } from '..';

describe('commands', () => {
  const commands = [new SlashCommand('testCommand', 'description test')];

  it('should get the build structure for all commands', () => {
    const commandsBuild = getCommandsBuild({ commands });
    const expected = [
      {
        description: 'description test',
        name: 'testCommand',
      },
    ];

    expect(commandsBuild).toEqual(expected);
  });

  it('should get commands linked to a property in object', () => {
    const commandsDict = getCommandsDict({ commands });
    const oneEntry = Object.entries(commandsDict)[0];

    expect(oneEntry[0]).toBe('testCommand');
    expect(oneEntry[1]).toBeInstanceOf(SlashCommand);
  });
});
