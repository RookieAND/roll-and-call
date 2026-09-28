import { createSupabaseBrowserClient } from "@/shared/api";
import { REVIEW_PHOTO_BUCKET, reviewPhotoPathOf } from "@/shared/lib";

// 등록하지 않고 나가면 이번에 올린 사진은 지운다. 실패해도 나가기는 막지 않는다.
export async function discardReviewPhotos(urls: string[]) {
  const paths = urls.flatMap((url) => reviewPhotoPathOf(url) ?? []);
  if (paths.length === 0) return;
  const { error } = await createSupabaseBrowserClient()
    .storage.from(REVIEW_PHOTO_BUCKET)
    .remove(paths);
  if (error) console.error("[write-review] discard photos failed:", error.message);
}
