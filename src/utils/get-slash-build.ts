import type SlashEntity from '../lib/slash-entity';

export default function getSlashBuild(slashes: Array<SlashEntity>) {
  return slashes.map((s) => s.build());
}
