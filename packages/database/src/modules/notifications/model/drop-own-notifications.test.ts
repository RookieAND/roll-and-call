import { describe, expect, it } from "vitest";

import { dropOwnNotifications } from "./drop-own-notifications";
import { NOTIFICATION_KIND, type NotificationInput } from "./notification-kind";

const confirmed = (userId: string, gameTitle = "검은 산의 노래"): NotificationInput => ({
  userId,
  kind: NOTIFICATION_KIND.participationConfirmed,
  params: { gameId: "g1", gameTitle },
});

describe("dropOwnNotifications", () => {
  it("조치한 사람에게 가는 항목을 버린다", () => {
    expect(
      dropOwnNotifications({ actorId: "a", notifications: [confirmed("a"), confirmed("b")] }),
    ).toEqual([confirmed("b")]);
  });

  it("actorId가 null이면 그대로 둔다", () => {
    expect(
      dropOwnNotifications({ actorId: null, notifications: [confirmed("a"), confirmed("b")] }),
    ).toEqual([confirmed("a"), confirmed("b")]);
  });

  it("완전히 같은 항목은 하나만 남긴다(params 칸 순서가 달라도)", () => {
    const reordered: NotificationInput = {
      userId: "b",
      kind: NOTIFICATION_KIND.participationConfirmed,
      params: { gameTitle: "검은 산의 노래", gameId: "g1" },
    };
    expect(
      dropOwnNotifications({
        actorId: null,
        notifications: [confirmed("b"), reordered, confirmed("b", "다른 구인")],
      }),
    ).toEqual([confirmed("b"), confirmed("b", "다른 구인")]);
  });
});
