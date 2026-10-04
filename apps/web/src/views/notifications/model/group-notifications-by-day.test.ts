import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { describe, expect, it } from "vitest";

import type { NotificationRow } from "@/shared/server";

import { groupNotificationsByDay } from "./group-notifications-by-day";

const now = new Date("2026-10-05T12:00:00+09:00");
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000);

describe("groupNotificationsByDay", () => {
  const row = (id: string, createdAt: Date): NotificationRow => ({
    id,
    createdAt,
    readAt: null,
    kind: NOTIFICATION_KIND.staffAdded,
    params: {},
  });

  it("날짜마다 묶고 순서를 지킨다", () => {
    const groups = groupNotificationsByDay({
      items: [
        row("a", minutesAgo(10)),
        row("b", minutesAgo(60)),
        row("c", new Date("2026-10-04T20:00:00+09:00")),
        row("d", new Date("2026-10-01T20:00:00+09:00")),
      ],
      now,
    });
    expect(groups.map((group) => [group.label, group.items.map((item) => item.id)])).toEqual([
      ["오늘", ["a", "b"]],
      ["어제", ["c"]],
      ["10월 1일", ["d"]],
    ]);
  });

  it("알림이 없으면 머리도 없다", () => {
    expect(groupNotificationsByDay({ items: [], now })).toEqual([]);
  });
});
