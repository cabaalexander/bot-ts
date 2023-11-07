import type SlashEntity from '../lib/slash-entity';
import getSlashBuild from '../utils/get-slash-build';
import getSlashDict from '../utils/get-slash-dict';
import invite from './invite';

// Entry point for commands
const allCommands: Array<SlashEntity> = [invite];

export const commandsBuild = getSlashBuild(allCommands);

export const commandsDict = getSlashDict(allCommands);
