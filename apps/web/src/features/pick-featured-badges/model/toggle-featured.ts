import { FEATURED_BADGE_LIMIT } from "@/entities/badge";

// 누르면 빼고, 없으면 끝에 더한다. 다 찼으면 그대로 둔다.
export function toggleFeatured(picked: string[], key: string): string[] {
  if (picked.includes(key)) return picked.filter((candidate) => candidate !== key);
  if (picked.length >= FEATURED_BADGE_LIMIT) return picked;
  return [...picked, key];
}
