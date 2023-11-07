import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashComponent from '../../lib/slash-component';
import getComponents from '../get-components';

describe('getComponents', () => {
  it('should get components structufe', () => {
    const component = new SlashComponent({
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      custom_id: 'foo_custom_id',
    });

    const components = getComponents([component]);
    const expectedComponents = {
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: 'foo_custom_id',
              style: 1,
              type: 2,
            },
          ],
        },
      ],
    };

    expect(components).toEqual(expectedComponents);
  });
});
