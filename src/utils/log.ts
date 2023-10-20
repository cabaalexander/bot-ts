/* eslint-disable no-console */

type LogOptions = {
  noLog: boolean;
};

export function logInfo(message: string, options?: LogOptions): void {
  if (options?.noLog) {
    return;
  }

  console.log('--[info]', message);
}

export function logError(message: string, options?: LogOptions) {
  if (options?.noLog) {
    return;
  }

  console.error(message);
}
