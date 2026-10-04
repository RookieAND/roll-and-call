import "server-only";
import { compact, uniq } from "es-toolkit";

import { CERT_PHOTO_BUCKET, certPhotoPathOf } from "@/shared/lib";

import { createSupabaseServerClient } from "./auth/create-supabase-server-client";

const SIGNED_URL_SECONDS = 3600;

// 사용자 앱은 본인 사진만 보므로 사용자 세션으로 서명한다(정책 cert_photos_read_own). 서비스 키를 쓰지 않는다.
// 서명하지 못한 키는 맵에 없고, 화면은 그 칸을 빈 칸으로 둔다.
export async function signCertPhotoUrls(keys: (string | null | undefined)[]) {
  const pathByKey = new Map(
    uniq(compact(keys)).flatMap((key) => {
      const path = certPhotoPathOf(key);
      return path ? [[key, path] as const] : [];
    }),
  );
  if (pathByKey.size === 0) return new Map<string, string>();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(CERT_PHOTO_BUCKET)
    .createSignedUrls(uniq([...pathByKey.values()]), SIGNED_URL_SECONDS);
  if (error) console.error("[cert-files] sign failed:", error.message);
  const signedByPath = new Map(
    (data ?? []).flatMap((entry) => {
      if (entry.error) console.error("[cert-files] sign failed:", entry.path, entry.error);
      return entry.error || !entry.path ? [] : [[entry.path, entry.signedUrl] as const];
    }),
  );
  return new Map(
    [...pathByKey].flatMap(([key, path]) => {
      const signedUrl = signedByPath.get(path);
      return signedUrl ? [[key, signedUrl] as const] : [];
    }),
  );
}
