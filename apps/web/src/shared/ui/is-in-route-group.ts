export function isInRouteGroup({ pathname, base }: { pathname: string; base: string }): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}
