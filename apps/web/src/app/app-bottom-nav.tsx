"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { navBadgesQueryKey } from "@/shared/api";
import { BottomNav } from "@/shared/ui";

import { fetchNavBadges } from "./fetch-nav-badges";

// 서버별로 한 번 묻는다. 화면을 옮기면 30초(기본 staleTime)가 지난 값만 다시 묻고, 액션·뮤테이션이 성공하면 바로 무효화한다.
export function AppBottomNav() {
  const pathname = usePathname();
  const { server } = useParams<{ server?: string }>();
  const queryClient = useQueryClient();
  const inTrial = !!server && pathname.startsWith(`/${server}/onboarding`);
  const queryKey = navBadgesQueryKey(server ?? "");
  const { data, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNavBadges(server!),
    throwOnError: false,
    enabled: !!server && !inTrial,
  });

  const shownPathname = useRef(pathname);
  useEffect(() => {
    if (shownPathname.current === pathname || !server) return;
    shownPathname.current = pathname;
    void queryClient.refetchQueries({ queryKey: navBadgesQueryKey(server), stale: true });
  }, [pathname, server, queryClient]);

  // 서버 밖 화면(도움말·둘러보기)과 튜토리얼 체험에는 탭이 없다.
  if (!server || inTrial) return null;
  const dots = {
    home: !isError && (data?.blockedTodo ?? false),
    notifications: !isError && (data?.unread ?? false),
  };
  return <BottomNav slug={server} dots={dots} />;
}
