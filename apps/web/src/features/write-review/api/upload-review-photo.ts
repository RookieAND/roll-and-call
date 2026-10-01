import {
  AUTH_REQUIRED_MESSAGE,
  createSupabaseBrowserClient,
  putWithProgress,
  shrinkImage,
} from "@/shared/api";
import { REVIEW_PHOTO_BUCKET } from "@/shared/lib";

import { PHOTO_MAX_SIDE } from "../model/photo-rules";

export type UploadResult = { url: string } | { error: string };

export async function uploadReviewPhoto({
  file,
  onProgress,
}: {
  file: File;
  onProgress: (ratio: number) => void;
}): Promise<UploadResult> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const upload = await shrinkImage({ file, maxSide: PHOTO_MAX_SIDE });
  const extension = upload.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(REVIEW_PHOTO_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: error.message };
  const status = await putWithProgress({ url: signed.signedUrl, file: upload, onProgress });
  if (status >= 400) return { error: `업로드 실패 (${status})` };

  const { data } = bucket.getPublicUrl(path);
  return { url: data.publicUrl };
}
