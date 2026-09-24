import { Ban, BookOpen, Calendar, Flag, User } from "lucide-react";

import { formatDate, withSubjectParticle } from "@/shared/lib";
import type { UserSearchResult } from "@/shared/server";
import { NAV_ITEMS } from "@/shared/ui";

import type { PaletteGroup } from "./palette-item";

// 닉네임이 맞으면 첫 번째 사람에게 할 수 있는 처리와 참여 세션을 묶는다.
// 불참 취소는 가장 최근 기록 하나만 띄우고, 나머지는 불참 기록 화면에서 찾는다.
export function buildSearchGroups(query: string, users: UserSearchResult[]): PaletteGroup[] {
  const screens = NAV_ITEMS.filter((item) => item.label.includes(query.trim())).map((item) => ({
    id: `screen-${item.key}`,
    icon: item.icon,
    title: item.label,
    href: item.href,
  }));
  const [first] = users;
  if (!first) return screens.length ? [{ label: "화면", items: screens }] : [];

  const groups: PaletteGroup[] = [
    {
      label: "유저",
      items: users.map((user, index) => ({
        id: `user-${user.id}`,
        icon: User,
        tone: index === 0 ? "primary" : "gray",
        title: user.nickname,
        meta: `참여 ${user.playedCount}회 · 최근 3개월 불참 ${user.recentNoShowCount}회`,
        href: `/users/${user.id}`,
      })),
    },
    {
      label: `${first.nickname}에 대한 처리`,
      items: [
        ...first.noShows.slice(0, 1).map((noShow) => ({
          id: `noshow-${noShow.id}`,
          icon: Flag,
          tone: "primary" as const,
          title: "불참 취소",
          meta: `${noShow.sessionTitle} · ${formatDate(noShow.startsAt)}`,
          href: `/noshow?q=${encodeURIComponent(first.nickname)}&record=${noShow.id}`,
        })),
        ...first.certApplications.map((application) => ({
          id: `cert-${application.id}`,
          icon: BookOpen,
          title: `${application.rulebook} 인증 심사`,
          meta: `${application.reapplied ? "재신청 · " : ""}${application.waitedDays}일째 대기`,
          href: `/cert/${application.id}`,
        })),
        {
          id: `sanction-${first.id}`,
          icon: Ban,
          tone: "danger" as const,
          title: "제재 패널 열기",
          href: `/users/${first.id}/sanction`,
        },
      ],
    },
  ];
  if (first.sessions.length > 0) {
    groups.push({
      label: `${withSubjectParticle(first.nickname)} 참여한 세션`,
      items: first.sessions.map((session) => ({
        id: `session-${session.id}`,
        icon: Calendar,
        title: session.title,
        meta: `${session.rulebook} · ${formatDate(session.startsAt)} · ${session.hosted ? "본인이 GM" : `GM ${session.gmNickname}`}`,
        href: `/posts/${session.id}`,
      })),
    });
  }
  if (screens.length) groups.push({ label: "화면", items: screens });
  return groups;
}
