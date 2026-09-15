export function isInRouteGroup(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}
