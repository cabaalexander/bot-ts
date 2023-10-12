import { type Bindings } from '../config/types';
import concatUrl from './concat-url';

export default function getCommandsUrl(env: Bindings, ...o: string[]) {
  return concatUrl(
    'applications',
    env.DISCORD_APPLICATION_ID,
    'commands',
    ...o,
  );
}
