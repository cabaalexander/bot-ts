import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashComponent from '../../lib/slash-component';
import getSlashBuild from '../../utils/get-slash-build';
import getSlashDict from '../../utils/get-slash-dict';

describe('components', () => {
  const components = [
    new SlashComponent({
      type: ComponentType.Button,
      label: 'Button emoji 🫶',
      style: ButtonStyle.Primary,
      custom_id: 'button_with_emoji',
    }),
  ];

  it('should get the build structure for all commands', () => {
    const commandsBuild = getSlashBuild(components);
    const expected = [
      {
        custom_id: 'button_with_emoji',
        label: 'Button emoji 🫶',
        style: 1,
        type: 2,
      },
    ];

    expect(commandsBuild).toEqual(expected);
  });

  it('should get components linked to a property in object', () => {
    const commandsDict = getSlashDict(components);
    const oneEntry = Object.entries(commandsDict)[0];

    expect(oneEntry[0]).toBe('button_with_emoji');
    expect(oneEntry[1]).toBeInstanceOf(SlashComponent);
  });
});
