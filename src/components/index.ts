import type SlashEntity from '../lib/slash-entity';
import getSlashBuild from '../utils/get-slash-build';
import getSlashDict from '../utils/get-slash-dict';
import emoji from './emoji';

// Entry point for commands
const allComponents: Array<SlashEntity> = [emoji];

export const componentsBuild = getSlashBuild(allComponents);

export const componentsDict = getSlashDict(allComponents);
