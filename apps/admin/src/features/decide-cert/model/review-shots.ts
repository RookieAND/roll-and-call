import { groupShots } from "./group-shots";
import { EBOOK_SHOTS, SHOTS, type ReviewShot } from "./shots";

interface ReviewShotsInput {
  ebook: boolean;
  grouped: boolean;
  photoUrls: Partial<Record<string, string>>;
}

export function reviewShots({
  ebook,
  grouped,
  photoUrls,
}: ReviewShotsInput): readonly ReviewShot[] {
  if (ebook) return EBOOK_SHOTS;
  return grouped ? groupShots(photoUrls) : SHOTS;
}
