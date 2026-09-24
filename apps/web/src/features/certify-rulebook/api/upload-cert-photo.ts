import { AUTH_REQUIRED_MESSAGE, createSupabaseBrowserClient, putWithProgress } from "@/shared/api";
import { CERT_PHOTO_BUCKET } from "@/shared/lib";

// 경로 첫 칸이 내 id여야 스토리지 정책이 올리기를 허락한다.
export async function uploadCertPhoto(
  file: File,
  onProgress: (ratio: number) => void,
): Promise<{ url: string } | { error: string }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(CERT_PHOTO_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: error.message };
  const status = await putWithProgress(signed.signedUrl, file, onProgress);
  if (status >= 400) return { error: `업로드 실패 (${status})` };
  return { url: bucket.getPublicUrl(path).data.publicUrl };
}
