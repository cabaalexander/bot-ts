import SlashCommand from '../../lib/slash-command';
import getSlashBuild from '../../utils/get-slash-build';
import getSlashDict from '../../utils/get-slash-dict';

describe('commands', () => {
  const commands = [new SlashCommand('testCommand', 'description test')];

  it('should get the build structure for all commands', () => {
    const commandsBuild = getSlashBuild(commands);
    const expected = [
      {
        description: 'description test',
        name: 'testCommand',
      },
    ];

    expect(commandsBuild).toEqual(expected);
  });

  it('should get commands linked to a property in object', () => {
    const commandsDict = getSlashDict(commands);
    const oneEntry = Object.entries(commandsDict)[0];

    expect(oneEntry[0]).toBe('testCommand');
    expect(oneEntry[1]).toBeInstanceOf(SlashCommand);
  });
});
