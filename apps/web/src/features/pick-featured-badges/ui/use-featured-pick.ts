"use client";

import { use } from "react";

import { FeaturedPickContext } from "./featured-pick-context";

export function useFeaturedPick() {
  const value = use(FeaturedPickContext);
  if (!value) throw new Error("대표 뱃지 선택 밖에서 쓸 수 없습니다.");
  return value;
}
