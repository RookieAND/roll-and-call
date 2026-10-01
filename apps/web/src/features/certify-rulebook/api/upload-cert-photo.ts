import {
  AUTH_REQUIRED_MESSAGE,
  createSupabaseBrowserClient,
  putWithProgress,
  shrinkImage,
} from "@/shared/api";
import { CERT_PHOTO_BUCKET } from "@/shared/lib";

import { CERT_PHOTO_MAX_SIDE } from "../model/cert-photo-rules";

// 경로 셋째 칸(servers/서버 id/내 id)이 내 id여야 스토리지 정책이 올리기를 허락한다.
export async function uploadCertPhoto({
  serverId,
  file,
  onProgress,
}: {
  serverId: string;
  file: File;
  onProgress: (ratio: number) => void;
}): Promise<{ url: string } | { error: string }> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const upload = await shrinkImage({ file, maxSide: CERT_PHOTO_MAX_SIDE });
  const extension = upload.name.split(".").pop() ?? "jpg";
  const path = `servers/${serverId}/${user.id}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from(CERT_PHOTO_BUCKET);
  const { data: signed, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { error: error.message };
  const status = await putWithProgress({ url: signed.signedUrl, file: upload, onProgress });
  if (status >= 400) return { error: `업로드 실패 (${status})` };
  return { url: bucket.getPublicUrl(path).data.publicUrl };
}
