import { EBOOK_SHOTS, GROUP_SHOT_KEYS, SHOTS, type ReviewShotKey } from "./shots";

export function isReviewShotKey(value: unknown): value is ReviewShotKey {
  return (
    [...SHOTS, ...EBOOK_SHOTS].some((shot) => shot.key === value) ||
    GROUP_SHOT_KEYS.some((key) => key === value)
  );
}
