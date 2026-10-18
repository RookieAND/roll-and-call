import "server-only";
import { signStorageUrls } from "@roll-and-call/app-kit/supabase/sign-storage-urls";
import { CERT_PHOTO_BUCKET, certPhotoPathOf } from "@roll-and-call/database/certifications/model";

// 어드민은 서비스 키 없이 운영진 세션으로 서명한다(정책 cert_photos_read_staff). 서명하지 못한 키(지워진 파일 등)는 맵에 없다.
export function signCertPhotoUrls(keys: string[]) {
  return signStorageUrls({ bucket: CERT_PHOTO_BUCKET, keys, pathOf: certPhotoPathOf });
}
