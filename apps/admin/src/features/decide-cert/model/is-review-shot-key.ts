import { EBOOK_SHOTS, SHOTS, type ReviewShotKey } from "./shots";

export function isReviewShotKey(value: unknown): value is ReviewShotKey {
  return [...SHOTS, ...EBOOK_SHOTS].some((shot) => shot.key === value);
}
