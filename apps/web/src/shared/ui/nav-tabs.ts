import { Bell, CalendarDays, List, User } from "lucide-react";

import { isInRouteGroup } from "./is-in-route-group";

// 하단 탭과 데스크톱 좌측 내비가 같이 쓰는 주요 메뉴. 점에는 숫자를 넣지 않는다.
// 홈은 막힌 할 일(세션 일시 미정), 알림은 이 서버의 안 읽은 알림.
export const NAV_TABS = [
  { path: "/", label: "홈", Icon: CalendarDays, dot: { key: "home", label: "막힌 할 일 있음" } },
  { path: "/games", label: "구인 목록", Icon: List, dot: null },
  {
    path: "/notifications",
    label: "알림",
    Icon: Bell,
    dot: { key: "notifications", label: "안 읽은 알림 있음" },
  },
  { path: "/me", label: "마이페이지", Icon: User, dot: null },
] as const;

// pathname은 서버 slug 뒤의 경로다.
export function isNavTabActive({ pathname, path }: { pathname: string; path: string }) {
  return path === "/" ? pathname === "/" : isInRouteGroup({ pathname, base: path });
}
