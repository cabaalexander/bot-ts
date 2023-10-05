/* eslint-disable no-console */

import {z} from 'zod';
import env from '../config/env';

const logSchema = z.array(z.unknown());

type Log = z.infer<typeof logSchema>;

export function logInfo(...args: Log): void {
  if (env.NO_LOG) {
    return;
  }

  console.log('--[info]', ...args);
}

export function logError(...args: Log) {
  if (env.NO_LOG) {
    return;
  }

  console.error(...args);
}
