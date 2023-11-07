import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

import SlashComponent from '../lib/slash-component';

const emoji = new SlashComponent({
  type: ComponentType.Button,
  label: 'Button emoji 🫶',
  style: ButtonStyle.Primary,
  custom_id: 'button_with_emoji',
});

export default emoji;
