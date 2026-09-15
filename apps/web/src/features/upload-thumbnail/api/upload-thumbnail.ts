import { AUTH_REQUIRED_MESSAGE, createSupabaseBrowserClient } from "@/shared/api";
import { GAME_IMAGE_BUCKET } from "@/shared/lib";

export type UploadResult = { url: string } | { error: string };

export async function uploadThumbnail(file: File): Promise<UploadResult> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const extension = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(GAME_IMAGE_BUCKET);
  const { error } = await bucket.upload(path, file, { upsert: false });
  if (error) return { error: error.message };

  const { data } = bucket.getPublicUrl(path);
  return { url: data.publicUrl };
}
