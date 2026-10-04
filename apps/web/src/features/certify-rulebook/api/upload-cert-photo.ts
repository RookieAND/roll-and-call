import {
  AUTH_REQUIRED_MESSAGE,
  createSupabaseBrowserClient,
  putWithProgress,
  shrinkImage,
} from "@/shared/api";
import { CERT_PHOTO_BUCKET } from "@/shared/lib";

import { CERT_PHOTO_MAX_SIDE } from "../model/cert-photo-rules";

// key는 공개 URL 모양 문자열이다. 버킷은 비공개라 그 주소로 열리지 않지만,
// 하루 정리 함수 orphan_storage_objects(0041)가 이 모양으로 연결 여부를 판단하므로 경로로 바꾸면 모든 인증 사진이 지워진다.
// 미리보기는 blob 주소(previewUrl)로 그리고, 칸을 지우거나 화면을 떠날 때 revokePreview로 푼다.
// 경로 셋째 칸(servers/서버 id/내 id)이 내 id여야 스토리지 정책이 올리기를 허락한다.
export async function uploadCertPhoto({
  serverId,
  file,
  onProgress,
}: {
  serverId: string;
  file: File;
  onProgress: (ratio: number) => void;
}): Promise<{ key: string; previewUrl: string } | { error: string }> {
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
  return { key: bucket.getPublicUrl(path).data.publicUrl, previewUrl: URL.createObjectURL(upload) };
}
