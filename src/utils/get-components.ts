import { ComponentType } from 'discord-api-types/v10';

import type SlashComponent from '../lib/slash-component';

export default function getComponents(children: Array<SlashComponent>) {
  return {
    components: [
      {
        type: ComponentType.ActionRow,
        components: children.map((c) => c.build()),
      },
    ],
  };
}
