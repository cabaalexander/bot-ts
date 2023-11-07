import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashCommand from '../../lib/slash-command';
import SlashComponent from '../../lib/slash-component';
import getSlashDict from '../get-slash-dict';

describe('getSlashDict', () => {
  it('should get commands dict', () => {
    const command = new SlashCommand('foo', 'bar');
    const commandsDict = getSlashDict([command]);
    const oneEntry = Object.entries(commandsDict)[0];

    expect(oneEntry[0]).toBe('foo');
    expect(oneEntry[1]).toBeInstanceOf(SlashCommand);
  });

  it('should get components dict', () => {
    const command = new SlashComponent({
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      custom_id: 'foom8',
    });
    const componentsDict = getSlashDict([command]);
    const oneEntry = Object.entries(componentsDict)[0];

    expect(oneEntry[0]).toBe('foom8');
    expect(oneEntry[1]).toBeInstanceOf(SlashComponent);
  });
});
