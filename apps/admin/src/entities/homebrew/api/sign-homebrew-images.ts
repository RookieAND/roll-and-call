import "server-only";
import { signStorageUrls } from "@roll-and-call/app-kit/supabase/sign-storage-urls";
import { CERT_PHOTO_BUCKET, certPhotoPathOf } from "@roll-and-call/database/certifications/model";

// 자작 룰 이미지도 인증 사진 버킷에 있다. 순서를 지키고, 서명하지 못한 이미지(지워진 파일 등)는 url이 null이다(이미지 오류 칸).
export async function signHomebrewImages(keys: string[]) {
  const signed = await signStorageUrls({
    bucket: CERT_PHOTO_BUCKET,
    keys,
    pathOf: certPhotoPathOf,
  });
  return keys.map((key) => ({ key, url: signed.get(key) ?? null }));
}
