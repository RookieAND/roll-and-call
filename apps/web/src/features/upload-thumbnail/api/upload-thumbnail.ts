import {
  AUTH_REQUIRED_MESSAGE,
  createSupabaseBrowserClient,
  putWithProgress,
  shrinkImage,
} from "@/shared/api";
import { GAME_IMAGE_BUCKET } from "@/shared/lib";

import { IMAGE_MAX_SIDE } from "../model/upload-rules";

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
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const upload = await shrinkImage({ file, maxSide: IMAGE_MAX_SIDE });
  const extension = upload.name.split(".").pop() ?? "png";
  const path = `servers/${serverId}/${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(GAME_IMAGE_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: error.message };
  const status = await putWithProgress({ url: signed.signedUrl, file: upload, onProgress });
  if (status >= 400) return { error: `업로드 실패 (${status})` };

  const { data } = bucket.getPublicUrl(path);
  return { url: data.publicUrl };
}
