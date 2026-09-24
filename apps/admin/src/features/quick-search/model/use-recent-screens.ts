"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { RecentScreen } from "./recent-screen";

const STORAGE_KEY = "admin:recent-screens";
const LIMIT = 5;
const TITLE_SUFFIX = / \| Roll & Call 어드민$/;

function readScreens(): RecentScreen[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RecentScreen[];
  } catch {
    return [];
  }
}

// 운영진 한 사람의 브라우저에만 남는 편의 기록이다. 비어 있어도 팔레트는 그대로 동작한다.
export function useRecentScreens() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [screens, setScreens] = useState<RecentScreen[]>([]);
  const href = searchParams.size ? `${pathname}?${searchParams}` : pathname;

  useEffect(() => {
    const title = document.title.replace(TITLE_SUFFIX, "");
    const next = [
      { href, title, visitedAt: Date.now() },
      ...readScreens().filter((screen) => screen.href !== href),
    ].slice(0, LIMIT + 1);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setScreens(next.slice(1));
  }, [href]);

  return screens;
}
