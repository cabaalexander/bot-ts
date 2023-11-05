import { InteractionType } from 'discord-api-types/v10';

import Followup from '../followup';
import Interaction from '../interaction';

describe('interaction', () => {
  const getInteraction = ({
    type,
    lastMessageId,
  }: {
    type?: InteractionType;
    lastMessageId?: string;
  } = {}) =>
    new Interaction({
      type: type ?? InteractionType.Ping,
      ...(lastMessageId && {
        channel: {
          id: '111',
          type: 0,
          last_message_id: lastMessageId,
        },
      }),
    });

  it('should create an interaction instance', () => {
    expect(getInteraction()).toBeInstanceOf(Interaction);
  });

  it('should get the type of the interaction', () => {
    expect(getInteraction().type).toBe(InteractionType.Ping);
  });

  it('should get structure', () => {
    const interaction = getInteraction({ lastMessageId: '181818' });
    const expectedStructure = {
      type: InteractionType.Ping,
      channel: { id: '111', type: 0, last_message_id: '181818' },
    };
    expect(interaction.structure).toEqual(expectedStructure);
  });

  it('should get return follow up instantce', () => {
    expect(getInteraction().followUp).toBeInstanceOf(Followup);
  });

  it('shoudl return empty if lastMessageId', () => {
    const interaction = getInteraction();
    expect(interaction.lastMessageId).toBe('');
  });

  it('should get lastMessageId', () => {
    const interaction = getInteraction({ lastMessageId: '182828' });
    expect(interaction.lastMessageId).toBe('182828');
  });
});
