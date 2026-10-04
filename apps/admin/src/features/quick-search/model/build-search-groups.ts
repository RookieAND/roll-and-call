import { isUndefined } from "es-toolkit";
import { BookOpen, Calendar, Flag, User } from "lucide-react";

import { formatDate, withSubjectParticle } from "@/shared/lib";
import type { UserSearchResult } from "@/shared/server";
import { NAV_ITEMS } from "@/shared/ui";

import type { PaletteGroup } from "./palette-item";

interface BuildSearchGroupsOptions {
  query: string;
  users: UserSearchResult[];
  owner: boolean;
}

// users는 서버가 닉네임 정확히 일치 → 앞부분 일치 → 부분 일치 순으로 준다.
// 처리·참여 세션 묶음은 맞는 유저가 1명이거나 닉네임이 정확히 같을 때만 붙인다(사람을 잘못 고르지 않게, D187).
// 불참 취소는 가장 최근 기록 하나만 띄우고, 나머지는 불참 기록 화면에서 찾는다.
export function buildSearchGroups({
  query,
  users,
  owner,
}: BuildSearchGroupsOptions): PaletteGroup[] {
  const keyword = query.trim();
  const screens = NAV_ITEMS.filter(
    (item) => (owner || !("ownerOnly" in item)) && item.label.includes(keyword),
  ).map((item) => ({
    id: `screen-${item.key}`,
    icon: item.icon,
    title: item.label,
    href: item.href,
  }));
  const screenGroups: PaletteGroup[] = screens.length ? [{ label: "화면", items: screens }] : [];
  if (users.length === 0) return screenGroups;

  const groups: PaletteGroup[] = [
    {
      label: "유저",
      items: users.map((user, index) => ({
        id: `user-${user.id}`,
        icon: User,
        tone: index === 0 ? "primary" : "gray",
        title: user.nickname,
        meta: `참여 ${user.playedCount}회 · 최근 30일 불참 ${user.recentNoShowCount}회`,
        href: `/users/${user.id}`,
      })),
    },
  ];
  const target =
    users.length === 1
      ? users[0]
      : users.find((user) => user.nickname.toLowerCase() === keyword.toLowerCase());
  if (isUndefined(target)) return [...groups, ...screenGroups];

  groups.push({
    label: `${target.nickname}에 대한 처리`,
    items: [
      ...target.noShows.slice(0, 1).map((noShow) => ({
        id: `noshow-${noShow.id}`,
        icon: Flag,
        tone: "primary" as const,
        title: "불참 취소",
        meta: `${noShow.sessionTitle} · ${formatDate(noShow.startsAt)}`,
        href: `/noshow?q=${encodeURIComponent(target.nickname)}&record=${noShow.id}`,
      })),
      ...target.certApplications.map((application) => ({
        id: `cert-${application.id}`,
        icon: BookOpen,
        title: `${application.rulebook} 인증 심사`,
        meta: `${application.reapplied ? "재신청 · " : ""}${application.waitedDays}일째 대기`,
        href: `/cert/${application.id}`,
      })),
      {
        id: `detail-${target.id}`,
        icon: User,
        title: "유저 상세 열기",
        href: `/users/${target.id}`,
      },
    ],
  });
  if (target.sessions.length > 0) {
    groups.push({
      label: `${withSubjectParticle(target.nickname)} 참여한 세션`,
      items: target.sessions.map((session) => ({
        id: `session-${session.id}`,
        icon: Calendar,
        title: session.title,
        meta: `${session.rulebook} · ${formatDate(session.startsAt)} · ${session.hosted ? "본인이 GM" : `GM ${session.gmNickname}`}`,
        href: `/posts/${session.id}`,
      })),
    });
  }
  return [...groups, ...screenGroups];
}
