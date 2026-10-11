import { certPhotoPathOf } from "@/shared/lib";

interface IsOwnCertFileInput {
  url: string;
  serverId: string;
  userId: string;
}

// 옛 업로드는 `${userId}/…`, 새 업로드는 `servers/${serverId}/${userId}/…`에 있다.
export function isOwnCertFile({ url, serverId, userId }: IsOwnCertFileInput) {
  const path = certPhotoPathOf(url);
  if (!path) return false;
  return path.startsWith(`${userId}/`) || path.startsWith(`servers/${serverId}/${userId}/`);
}
