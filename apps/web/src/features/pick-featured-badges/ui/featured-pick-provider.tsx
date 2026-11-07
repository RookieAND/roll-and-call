"use client";

import { useMemo, useState, type ReactNode } from "react";

import { FeaturedPickContext } from "./featured-pick-context";

interface FeaturedPickProviderProps {
  initialKeys: string[];
  children: ReactNode;
}

// 선택 화면과 데스크톱 미리보기 패널이 고른 뱃지를 함께 쓴다.
export function FeaturedPickProvider({ initialKeys, children }: FeaturedPickProviderProps) {
  const [picked, setPicked] = useState(initialKeys);
  const value = useMemo(() => ({ picked, setPicked }), [picked]);
  return <FeaturedPickContext value={value}>{children}</FeaturedPickContext>;
}
