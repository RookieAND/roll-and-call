import { certPhotoPathOf as storedCertPhotoPathOf } from "@roll-and-call/database/certifications/model";

import { isSupabaseUrl } from "@/shared/lib";

// 우리 Supabase 주소일 때만 경로로 본다. 지우기·본인 파일 확인이 다른 호스트 주소를 믿지 않게 한다.
export function certPhotoPathOf(url: string) {
  return isSupabaseUrl(url) ? storedCertPhotoPathOf(url) : null;
}
