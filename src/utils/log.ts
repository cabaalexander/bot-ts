/* eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-argument
*/

export function logInfo(...args: any[]): void {
  console.log('--[info]', ...args);
}

export function logError(...args: any[]) {
  console.error(...args);
}
