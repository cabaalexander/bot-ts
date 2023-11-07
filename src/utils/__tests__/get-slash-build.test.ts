import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashCommand from '../../lib/slash-command';
import SlashComponent from '../../lib/slash-component';
import getSlashBuild from '../get-slash-build';

describe('getSlashBuild', () => {
  it('should get build structure for commands', () => {
    const command = new SlashCommand('random', 'random desc');

    const commandBuilds = getSlashBuild([command]);
    const expectedCommandBuilds = [
      { name: 'random', description: 'random desc' },
    ];

    expect(commandBuilds).toEqual(expectedCommandBuilds);
  });

  it('should get build structure for components', () => {
    const component = new SlashComponent({
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      custom_id: 'custom_id_m8',
    });

    const componentBuilds = getSlashBuild([component]);
    const expectedComponentBuilds = [
      { type: 2, style: 1, custom_id: 'custom_id_m8' },
    ];

    expect(componentBuilds).toEqual(expectedComponentBuilds);
  });
});
