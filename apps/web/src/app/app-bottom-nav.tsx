"use client";

import { useNavBadges } from "@/shared/api";
import { BottomNav } from "@/shared/ui";

// 서버 밖 화면(도움말·둘러보기)과 튜토리얼 체험에는 탭이 없다.
export function AppBottomNav() {
  const badges = useNavBadges();
  if (!badges) return null;
  return <BottomNav slug={badges.server} dots={badges.dots} />;
}
