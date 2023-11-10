import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashComponent from '../slash-component';

describe('SlashComponent', () => {
  const mockHandler = jest.fn();
  const component = new SlashComponent({
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    custom_id: 'custom_m8',
  });
  component.handle(mockHandler);

  it('should get component build', () => {
    const buildExpected = {
      custom_id: 'custom_m8',
      type: 2,
      style: 1,
    };
    expect(component.build()).toStrictEqual(buildExpected);
  });
});
