import { createSupabaseBrowserClient } from "@/shared/api";
import { REVIEW_PHOTO_BUCKET, reviewPhotoPathOf } from "@/shared/lib";

// 실패해도 나가기는 막지 않는다.
export async function discardReviewPhotos(urls: string[]) {
  const paths = urls.flatMap((url) => reviewPhotoPathOf(url) ?? []);
  if (paths.length === 0) return;
  const { error } = await createSupabaseBrowserClient()
    .storage.from(REVIEW_PHOTO_BUCKET)
    .remove(paths);
  if (error) console.error("[write-review] discard photos failed:", error.message);
}
