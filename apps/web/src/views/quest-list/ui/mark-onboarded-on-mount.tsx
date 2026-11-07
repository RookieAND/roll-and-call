"use client";

import { useEffect } from "react";

import { markOnboardedAction } from "../api/mark-onboarded-action";

// 목록에 들어온 순간 온보딩을 마친 것으로 친다. 렌더나 prefetch만으로는 쓰지 않도록 마운트 뒤 액션으로 쓴다.
// 이미 마친 계정은 markOnboarded가 시각을 덮어쓰지 않는다. 실패하면 다음에 홈에서 한 번 더 올 뿐이라 알리지 않는다.
export function MarkOnboardedOnMount() {
  useEffect(() => {
    void markOnboardedAction().catch(() => undefined);
  }, []);
  return null;
}
