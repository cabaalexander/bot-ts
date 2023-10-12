export default function concatUrl(
  url: string,
  ...extraParams: string[]
): string {
  const regexReplace = (t: string) => t.replace(/([^:])\/{2,}/g, '$1/');

  if (extraParams?.length) {
    return regexReplace(`${url}/${extraParams.map((p) => `/${p}`).join('')}`);
  }

  return regexReplace(url);
}
