import { CERT_BULK_PHOTO_KEYS } from "@/entities/rulebook";

// 신청 한 건의 사진 칸(앞면·뒷면·추가 증빙)에 묶음 사진을 순서대로 담는다.
export function bulkPhotoUrls(photos: readonly string[]) {
  const urls: Partial<Record<(typeof CERT_BULK_PHOTO_KEYS)[number], string>> = {};
  CERT_BULK_PHOTO_KEYS.forEach((key, index) => {
    const photo = photos[index];
    if (photo) urls[key] = photo;
  });
  return urls;
}
