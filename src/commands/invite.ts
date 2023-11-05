import type {
  RESTError,
  RESTGetAPIChannelMessageResult,
} from 'discord-api-types/v10';
import {
  InteractionResponseType,
  MessageFlags,
  Routes,
} from 'discord-api-types/v10';

import SlashCommand from '../lib/slash-command';

const invite = new SlashCommand(
  'invite',
  'Get an invite link to add the bot to your server',
);

invite.handle(async ({ i, c }) => {
  const inviteUrl = new URL(
    `https://discord.com${Routes.oauth2Authorization()}`,
  );
  inviteUrl.searchParams.append('client_id', c.env.DISCORD_APPLICATION_ID);
  inviteUrl.searchParams.append('scope', 'applications.commands');

  // start a followup reply
  i.defer(async () => {
    await i.followUp.reply({
      content: `👆 Heres's your invite link 👋`,
      flags: MessageFlags.Ephemeral,
    });

    // get last message content (non-ephemeral)
    const lastMessage = await i.followUp.get();
    const lastMessageData = await lastMessage.json<
      RESTGetAPIChannelMessageResult | RESTError
    >();

    // exit early if error
    if ('code' in lastMessageData) {
      return;
    }

    const lastMessageContent = lastMessageData.content;

    // edit last message (then toggle it back)
    if (
      lastMessageContent.startsWith('-! ') &&
      lastMessageContent.endsWith(' !-')
    ) {
      const stripOutFormat = lastMessageContent.replace(/^-!\s(.+)\s!-/, '$1');
      await i.followUp.edit({ content: stripOutFormat });
    } else {
      await i.followUp.edit({ content: `-! ${lastMessageContent} !-` });
    }
  });

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: inviteUrl.toString(), flags: MessageFlags.Ephemeral },
  };
});

export default invite;
