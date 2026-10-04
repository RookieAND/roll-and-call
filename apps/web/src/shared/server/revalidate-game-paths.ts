import "server-only";
import { revalidatePath } from "next/cache";

import { serverPath } from "@/shared/lib";

// 세션 마치기·출석 확정처럼 구인 상세·운영 관리·참여자 관리·출석 확인·마이페이지가 함께 바뀌는 일.
export function revalidateGamePaths({ slug, gameId }: { slug: string; gameId: string }) {
  const gamePath = serverPath({ slug, path: `/games/${gameId}` });
  revalidatePath(`${gamePath}/attendance`);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(gamePath);
  revalidatePath(serverPath({ slug, path: "/me" }));
  revalidatePath(serverPath({ slug, path: "/me/sessions" }));
}
