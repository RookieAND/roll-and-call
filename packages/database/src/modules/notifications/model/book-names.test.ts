import { describe, expect, it } from "vitest";

import { bookNames } from "./book-names";
import { NOTIFICATION_KIND } from "./notification-kind";
import { notificationText } from "./notification-text";

describe("bookNames", () => {
  it("한 권이면 이름 그대로, 묶음이면 외 N권", () => {
    expect(bookNames({ rulebookName: "D&D" })).toBe("D&D");
    expect(bookNames({ rulebookName: "D&D", otherCount: 0 })).toBe("D&D");
    expect(bookNames({ rulebookName: "D&D", otherCount: 7 })).toBe("D&D 외 7권");
  });

  it("묶음 승인·반려 알림 줄에 외 N권이 들어간다", () => {
    const params = { rulebookId: "r1", rulebookName: "D&D", otherCount: 2 };
    expect(notificationText({ kind: NOTIFICATION_KIND.certApproved, params }).strong).toBe(
      "D&D 외 2권",
    );
    expect(
      notificationText({
        kind: NOTIFICATION_KIND.certRejected,
        params: { ...params, rejectionSummary: "x" },
      }).strong,
    ).toBe("D&D 외 2권");
  });
});
