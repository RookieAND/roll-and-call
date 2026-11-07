import { ONBOARDING_QUEST } from "@roll-and-call/database/onboarding/model";
import { describe, expect, it } from "vitest";

import { CLEAR_TARGET, clearedDestination } from "./cleared-destination";

describe("clearedDestination", () => {
  it("기본은 목록이고 방금 깬 퀘스트를 알린다", () => {
    expect(
      clearedDestination({
        quest: ONBOARDING_QUEST.firstApply,
        to: CLEAR_TARGET.list,
        badgeGranted: false,
      }),
    ).toBe("/onboarding?cleared=first_apply");
  });

  it("다음 퀘스트로는 같은 갈래의 다음 퀘스트로 간다", () => {
    expect(
      clearedDestination({
        quest: ONBOARDING_QUEST.firstApply,
        to: CLEAR_TARGET.next,
        badgeGranted: false,
      }),
    ).toBe("/onboarding/first-review");
    expect(
      clearedDestination({
        quest: ONBOARDING_QUEST.rulebookCert,
        to: CLEAR_TARGET.next,
        badgeGranted: false,
      }),
    ).toBe("/onboarding/first-recruit");
  });

  it("실제 서비스 주소로 간다", () => {
    expect(
      clearedDestination({
        quest: ONBOARDING_QUEST.firstReview,
        to: "/games",
        badgeGranted: false,
      }),
    ).toBe("/games");
  });

  it("업적을 받았으면 어디로 가든 목록의 업적 시트를 먼저 보인다", () => {
    expect(
      clearedDestination({
        quest: ONBOARDING_QUEST.firstRecruit,
        to: "/games/new",
        badgeGranted: true,
      }),
    ).toBe("/onboarding?cleared=first_recruit&achievement=1");
  });
});
