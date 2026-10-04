import { describe, expect, it } from "vitest";

import { notificationTimeLabel } from "./notification-time-label";

const now = new Date("2026-10-05T12:00:00+09:00");
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000);

describe("notificationTimeLabel", () => {
  it("1분 미만은 1분 전, 59분은 분 전, 60분부터는 HH:mm", () => {
    expect(notificationTimeLabel(minutesAgo(0), now)).toBe("1분 전");
    expect(notificationTimeLabel(minutesAgo(12), now)).toBe("12분 전");
    expect(notificationTimeLabel(minutesAgo(59), now)).toBe("59분 전");
    expect(notificationTimeLabel(minutesAgo(60), now)).toBe("11:00");
  });
});
