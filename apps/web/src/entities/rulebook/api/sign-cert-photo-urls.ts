import "server-only";
import { signStorageUrls } from "@roll-and-call/app-kit/supabase/sign-storage-urls";
import { compact } from "es-toolkit";

import { CERT_PHOTO_BUCKET } from "@/shared/lib";

import { certPhotoPathOf } from "../model/cert-photo-path";

// 사용자 앱은 본인 사진만 보므로 사용자 세션으로 서명한다(정책 cert_photos_read_own). 서비스 키를 쓰지 않는다.
// 서명하지 못한 키는 맵에 없고, 화면은 그 칸을 빈 칸으로 둔다.
export function signCertPhotoUrls(keys: (string | null | undefined)[]) {
  return signStorageUrls({
    bucket: CERT_PHOTO_BUCKET,
    keys: compact(keys),
    pathOf: certPhotoPathOf,
    onError: (...details) => console.error("[cert-files] sign failed:", ...details),
  });
}
