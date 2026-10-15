export function extensionOf(url: string) {
  return new URL(url).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
}
