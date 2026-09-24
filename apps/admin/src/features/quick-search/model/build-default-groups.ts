import { Ban, FileText, History } from "lucide-react";

import { PENDING_COPY, formatRelativeTime } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";
import { NAV_ITEMS } from "@/shared/ui";

import type { PaletteGroup } from "./palette-item";
import type { RecentScreen } from "./recent-screen";

export function buildDefaultGroups(
  pendingItems: PendingItem[],
  recentScreens: RecentScreen[],
): PaletteGroup[] {
  const groups: PaletteGroup[] = [];
  if (pendingItems.length > 0) {
    groups.push({
      label: "지금 처리해야 하는 일",
      items: pendingItems.map((item, index) => {
        const copy = PENDING_COPY[item.kind];
        return {
          id: `pending-${item.kind}`,
          icon: copy.icon,
          tone: index === 0 ? "primary" : "gray",
          title: copy.label,
          meta: copy.paletteMeta(item.count, item.oldestDays),
          href: copy.href,
          shortcut: copy.shortcut,
        };
      }),
    });
  }
  if (recentScreens.length > 0) {
    groups.push({
      label: "최근에 본 화면",
      items: recentScreens.map((screen) => ({
        id: `recent-${screen.href}`,
        icon: NAV_ITEMS.findLast((item) => screen.href.startsWith(item.href))?.icon ?? History,
        title: screen.title,
        meta: formatRelativeTime(new Date(screen.visitedAt)),
        href: screen.href,
      })),
    });
  }
  groups.push({
    label: "명령",
    items: [
      {
        id: "command-sanction",
        icon: Ban,
        tone: "danger",
        title: "유저 제재하기",
        meta: "닉네임을 입력하면 제재 패널이 바로 열립니다",
        href: "/users",
      },
      { id: "command-rulebook", icon: FileText, title: "룰북 추가하기", href: "/rules?add=1" },
    ],
  });
  return groups;
}
