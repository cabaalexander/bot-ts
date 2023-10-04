import {z} from 'zod';

const logSchema = z.array(z.unknown());

type Log = z.infer<typeof logSchema>;

export function logInfo(...args: Log): void {
  console.log('--[info]', ...args);
}

export function logError(...args: Log) {
  console.error(...args);
}
