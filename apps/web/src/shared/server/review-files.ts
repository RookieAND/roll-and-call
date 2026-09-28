import "server-only";
import { compact, uniq } from "es-toolkit";

import { REVIEW_PHOTO_BUCKET, reviewPhotoPathOf } from "@/shared/lib";

import { createSupabaseServerClient } from "./auth/create-supabase-server-client";

// 후기 사진은 한 후기에만 쓰이므로 빠진 URL은 바로 지운다.
// 사용자 세션으로 지우므로 스토리지 정책(owner = auth.uid())상 본인이 올린 파일만 지워진다.
// ponytail: best-effort. 실패하면 파일이 남을 뿐 저장·삭제는 막지 않는다.
export async function removeUnusedReviewPhotos(urls: string[]) {
  const paths = compact(uniq(urls).map(reviewPhotoPathOf));
  if (paths.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(REVIEW_PHOTO_BUCKET).remove(paths);
  if (error) console.error("[review-files] storage remove failed:", error.message);
}
