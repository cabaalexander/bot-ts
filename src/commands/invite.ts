import {
  InteractionResponseType,
  MessageFlags,
  Routes,
} from 'discord-api-types/v10';

import SlashCommand from '../lib/slash-command';

export default new SlashCommand()
  .setName('invite')
  .setDescription('Get an invite link to add the bot to your server')
  .handle(({ c }) => {
    const inviteUrl = new URL(
      `https://discord.com${Routes.oauth2Authorization()}`,
    );
    inviteUrl.searchParams.append('client_id', c.env.DISCORD_APPLICATION_ID);
    inviteUrl.searchParams.append('scope', 'applications.commands');

    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: inviteUrl.toString(), flags: MessageFlags.Ephemeral },
    };
  });
