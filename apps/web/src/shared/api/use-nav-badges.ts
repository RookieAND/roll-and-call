"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { fetchNavBadges } from "./fetch-nav-badges";
import { navBadgesQueryKey } from "./nav-badges-query-key";

// 하단 탭과 데스크톱 좌측 내비가 함께 읽는다. 서버별로 한 번 묻고, 화면을 옮기면 30초(기본 staleTime)가 지난 값만 다시 묻는다.
// 액션·뮤테이션이 성공하면 바로 무효화한다. 서버 밖 화면과 튜토리얼 체험에서는 묻지 않고 null을 돌려준다.
export function useNavBadges() {
  const pathname = usePathname();
  const { server } = useParams<{ server?: string }>();
  const queryClient = useQueryClient();
  const inTrial = !!server && pathname.startsWith(`/${server}/onboarding`);
  const { data, isError } = useQuery({
    queryKey: navBadgesQueryKey(server ?? ""),
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

  if (!server || inTrial) return null;
  return {
    server,
    dots: {
      home: !isError && (data?.blockedTodo ?? false),
      notifications: isError ? 0 : (data?.unread ?? 0),
    },
  };
}
