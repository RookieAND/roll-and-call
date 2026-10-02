"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { RecentScreen } from "./recent-screen";

const STORAGE_KEY_PREFIX = "admin:recent-screens";
const LIMIT = 5;
const TITLE_SUFFIX = / \| Roll & Call 어드민$/;

function readScreens(storageKey: string): RecentScreen[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as RecentScreen[];
  } catch {
    return [];
  }
}

// 운영진 한 사람의 브라우저에만 남는 편의 기록이다. 비어 있어도 팔레트는 그대로 동작한다.
export function useRecentScreens() {
  const { server } = useParams<{ server: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [screens, setScreens] = useState<RecentScreen[]>([]);
  const storageKey = `${STORAGE_KEY_PREFIX}:${server}`;
  // 팔레트가 지금 서버의 slug를 붙여 이동하므로 slug 없는 서버 안 경로로 남긴다.
  const serverInternalPath = pathname.slice(`/${server}`.length) || "/";
  const href = searchParams.size ? `${serverInternalPath}?${searchParams}` : serverInternalPath;

  useEffect(() => {
    const title = document.title.replace(TITLE_SUFFIX, "");
    const next = [
      { href, title, visitedAt: Date.now() },
      ...readScreens(storageKey).filter((screen) => screen.href !== href),
    ].slice(0, LIMIT + 1);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
    setScreens(next.slice(1));
  }, [href, storageKey]);

  return screens;
}
