import type { z } from 'zod';

import type { slashCommandSchema } from '../lib/slash-command';
import type SlashCommand from '../lib/slash-command';
import invite from './invite';

// Entry point for commands
const commands: Array<SlashCommand> = [invite];

export function getCommandsBuild(): Array<z.infer<typeof slashCommandSchema>> {
  return commands.map((c) => c.build());
}

export function getCommandsDict() {
  return commands.reduce<Record<string, SlashCommand>>((result, c) => {
    const { name } = c.build();
    return {
      [name]: c,
    };
  }, {});
}
