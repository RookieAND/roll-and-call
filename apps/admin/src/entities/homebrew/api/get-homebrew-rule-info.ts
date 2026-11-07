import "server-only";
import { loadHomebrewRuleInfo } from "@roll-and-call/database/homebrew";

import { getCurrentServer, requireStaff } from "@/shared/server";

import { signHomebrewImages } from "./sign-homebrew-images";

// 룰북 상세의 「자작 룰 정보」와 [심사 자료 보기] 창. 자작 룰이 아니면 null이다.
export async function getHomebrewRuleInfo(rulebookId: string) {
  await requireStaff();
  const server = await getCurrentServer();
  const info = await loadHomebrewRuleInfo({ serverId: server.id, rulebookId });
  if (!info) return null;
  return { ...info, images: await signHomebrewImages(info.imageUrls) };
}

export type HomebrewRuleInfo = NonNullable<Awaited<ReturnType<typeof getHomebrewRuleInfo>>>;
