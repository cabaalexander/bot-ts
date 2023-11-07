import type SlashEntity from '../lib/slash-entity';

export default function getSlashDict(slashes: Array<SlashEntity>) {
  return slashes.reduce<Record<string, SlashEntity>>((acc, s) => {
    const build = s.build();

    const key = 'custom_id' in build ? build.custom_id : build.name;

    acc[key] = s;

    return acc;
  }, {});
}
