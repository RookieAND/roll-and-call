import { createClient } from "@/shared/api/supabase/client";

export type UploadResult = { url: string } | { error: string };

export async function uploadThumbnail(file: File): Promise<UploadResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("game-thumbnails")
    .upload(path, file, { upsert: false });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("game-thumbnails").getPublicUrl(path);
  return { url: data.publicUrl };
}
