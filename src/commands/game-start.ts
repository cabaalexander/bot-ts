import { InteractionResponseType } from 'discord-api-types/v10';

import SlashCommand from '../lib/slash-command';

export default new SlashCommand()
  .setName('game-start')
  .setDescription('Welcome to La villa')
  .handle(() => {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: 'test command serving 321' },
    };
  });
