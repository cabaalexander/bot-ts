import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';

import discordError from '../discord-error';

describe('discordError', () => {
  it('should return discord message formatted error', async () => {
    const res = discordError('asdf');
    const data = await res.json();
    const expected = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: '💥 asdf', flags: MessageFlags.Ephemeral },
    };
    expect(data).toEqual(expected);
  });
});
