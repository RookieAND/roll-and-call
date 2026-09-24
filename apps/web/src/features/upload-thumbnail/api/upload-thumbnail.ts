import { AUTH_REQUIRED_MESSAGE, createSupabaseBrowserClient, putWithProgress } from "@/shared/api";
import { GAME_IMAGE_BUCKET } from "@/shared/lib";

export type UploadResult = { url: string } | { error: string };

export async function uploadThumbnail(
  file: File,
  onProgress: (ratio: number) => void = () => {},
): Promise<UploadResult> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const extension = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(GAME_IMAGE_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: error.message };
  const status = await putWithProgress(signed.signedUrl, file, onProgress);
  if (status >= 400) return { error: `업로드 실패 (${status})` };

  const { data } = bucket.getPublicUrl(path);
  return { url: data.publicUrl };
}
