import type { TComponentArgs } from '../config/types';
import SlashEntity from './slash-entity';

export default class SlashComponent extends SlashEntity {
  constructor(private readonly componentJson: TComponentArgs) {
    super();
  }

  build(): TComponentArgs {
    return this.componentJson;
  }
}
