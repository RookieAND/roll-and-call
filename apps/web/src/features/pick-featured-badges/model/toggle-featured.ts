import { FEATURED_BADGE_LIMIT } from "@/entities/badge";

export function toggleFeatured({ picked, key }: { picked: string[]; key: string }): string[] {
  if (picked.includes(key)) return picked.filter((candidate) => candidate !== key);
  if (picked.length >= FEATURED_BADGE_LIMIT) return picked;
  return [...picked, key];
}
