import "server-only";
import { CERT_PHOTO_BUCKET, certPhotoPathOf } from "@roll-and-call/database/certifications/model";
import { compact, isNull, uniq } from "es-toolkit";

import { createSupabaseServerClient } from "../auth/create-supabase-server-client";

const SIGNED_URL_SECONDS = 3600;

// 어드민은 서비스 키 없이 운영진 세션으로 서명한다(정책 cert_photos_read_staff). 서명하지 못한 키(지워진 파일 등)는 맵에 없다.
export async function signCertPhotoUrls(keys: string[]) {
  const paths = uniq(compact(keys.map(certPhotoPathOf)));
  if (paths.length === 0) return new Map<string, string>();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.storage
    .from(CERT_PHOTO_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_SECONDS);
  const signed = new Map(
    (data ?? []).flatMap((entry) =>
      entry.error || isNull(entry.path) ? [] : [[entry.path, entry.signedUrl] as const],
    ),
  );
  return new Map(
    keys.flatMap((key) => {
      const path = certPhotoPathOf(key);
      const url = path ? signed.get(path) : undefined;
      return url ? [[key, url] as const] : [];
    }),
  );
}
