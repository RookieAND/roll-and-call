import { RESERVED_SERVER_SLUGS } from "./reserved-server-slugs";

const reserved: ReadonlySet<string> = new Set(RESERVED_SERVER_SLUGS);

export function isServerSlug(segment: string | undefined): segment is string {
  return !!segment && !reserved.has(segment) && !segment.includes(".");
}
