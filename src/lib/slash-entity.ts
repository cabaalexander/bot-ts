import type {
  TInteractionArgs,
  TInteractionCallback,
  TSlashBuild,
} from '../config/types';
import discordError from '../utils/discord-error';

export default abstract class SlashEntity {
  private interactionCallback!: TInteractionCallback;

  abstract build(): TSlashBuild;

  handle(interactionCallback: TInteractionCallback): this {
    this.interactionCallback = interactionCallback;
    return this;
  }

  execute(args: TInteractionArgs) {
    if (!this.interactionCallback) {
      const errorRes = discordError('not implemented');
      return errorRes.json();
    }

    return this.interactionCallback(args);
  }
}
