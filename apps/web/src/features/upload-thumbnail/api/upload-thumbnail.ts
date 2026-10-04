import { AUTH_REQUIRED_MESSAGE, createSupabaseBrowserClient, putWithProgress } from "@/shared/api";
import { GAME_IMAGE_BUCKET } from "@/shared/lib";

import { uploadFailedMessage } from "../model/upload-failed-message";
import { shrinkForUpload } from "./shrink-for-upload";

// error는 화면에 그대로 보일 문구다.
export type UploadResult = { url: string } | { error: string };

export async function uploadThumbnail({
  serverId,
  file,
  onProgress = () => {},
}: {
  serverId: string;
  file: File;
  onProgress?: (ratio: number) => void;
}): Promise<UploadResult> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: uploadFailedMessage(AUTH_REQUIRED_MESSAGE) };

  const shrunk = await shrinkForUpload(file);
  if ("error" in shrunk) return shrunk;
  const upload = shrunk.file;
  const extension = upload.name.split(".").pop() ?? "png";
  const path = `servers/${serverId}/${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(GAME_IMAGE_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: uploadFailedMessage(error.message) };
  const status = await putWithProgress({ url: signed.signedUrl, file: upload, onProgress });
  if (status >= 400) return { error: uploadFailedMessage(`업로드 실패 (${status})`) };

  const { data } = bucket.getPublicUrl(path);
  return { url: data.publicUrl };
}
