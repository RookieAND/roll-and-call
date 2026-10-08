import "server-only";
import { REVIEW_PHOTO_BUCKET } from "@/shared/lib";

import { createSupabaseAdminClient } from "./auth/create-supabase-admin-client";

const DISCORD_CDN_HOSTS = ["cdn.discordapp.com", "media.discordapp.net"];

export interface ReviewPhotoSource {
  url: string;
  contentType: string;
}

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// 디스코드 첨부 주소는 곧 만료되므로 내려받아 후기 사진 버킷에 옮긴다. 웹 업로드와 같은 경로 규칙(servers/서버/작성자/)이라 작성자 검증을 그대로 통과한다.
// ponytail: 줄이지 않고 원본을 올린다(호출하는 쪽이 5MB로 거른다). 중간에 실패해 남은 파일은 고아 파일 정리(0041)가 치운다.
export async function uploadReviewPhotos({
  serverId,
  userId,
  sources,
}: {
  serverId: string;
  userId: string;
  sources: ReviewPhotoSource[];
}): Promise<string[]> {
  const bucket = createSupabaseAdminClient().storage.from(REVIEW_PHOTO_BUCKET);
  return Promise.all(
    sources.map(async ({ url, contentType }) => {
      if (!DISCORD_CDN_HOSTS.includes(new URL(url).hostname)) throw new Error("not a discord url");
      const response = await fetch(url);
      if (!response.ok) throw new Error(`photo download failed (${response.status})`);

      const path = `servers/${serverId}/${userId}/${crypto.randomUUID()}.${EXTENSION_BY_CONTENT_TYPE[contentType]}`;
      const { error } = await bucket.upload(path, await response.arrayBuffer(), { contentType });
      if (error) throw error;
      return bucket.getPublicUrl(path).data.publicUrl;
    }),
  );
}
