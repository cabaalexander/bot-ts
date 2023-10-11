/* eslint-disable no-console */

import {type Bindings} from '../config/types';

type LogOptions = {
  env: Bindings;
};

export function logInfo(message: string, options?: LogOptions): void {
  if (options?.env.NO_LOG) {
    return;
  }

  console.log('--[info]', message);
}

export function logError(message: string, options?: LogOptions) {
  if (options?.env.NO_LOG) {
    return;
  }

  console.error(message);
}
