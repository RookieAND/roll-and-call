"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { navBadgesQueryKey } from "@/shared/api";
import { BottomNav } from "@/shared/ui";

import { fetchNavBadges } from "./fetch-nav-badges";

// 서버별로 한 번 묻고, 화면을 옮길 때마다 다시 묻는다. 새 값이 올 때까지 이전 점이 그대로 보인다.
export function AppBottomNav() {
  const pathname = usePathname();
  const { server } = useParams<{ server?: string }>();
  const queryClient = useQueryClient();
  const queryKey = navBadgesQueryKey(server ?? "");
  const { data, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNavBadges(server!),
    throwOnError: false,
    enabled: !!server,
  });

  const shownPathname = useRef(pathname);
  useEffect(() => {
    if (shownPathname.current === pathname || !server) return;
    shownPathname.current = pathname;
    void queryClient.invalidateQueries({ queryKey: navBadgesQueryKey(server) });
  }, [pathname, server, queryClient]);

  // 서버 밖 화면(도움말·둘러보기)에는 탭이 없다.
  if (!server) return null;
  const dots = {
    home: !isError && (data?.blockedTodo ?? false),
    notifications: !isError && (data?.unread ?? false),
  };
  return <BottomNav slug={server} dots={dots} />;
}
