import { describe, expect, it } from "vitest";

import { CERT_STATE, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";
import type { CertApplication } from "@/shared/server";

import { toBookResult } from "./to-book-result";

const KEY = "https://x.supabase.co/storage/v1/object/public/cert-photos/servers/s/u/front.jpg";
const SIGNED =
  "https://x.supabase.co/storage/v1/object/sign/cert-photos/servers/s/u/front.jpg?token=t";

function application(partial: Partial<CertApplication>): CertApplication {
  return {
    id: "a",
    serverId: "s",
    userId: "u",
    rulebookId: "r",
    memo: "",
    photoUrls: { front: KEY, back: KEY, side: KEY },
    replacedShots: [],
    groupId: null,
    format: "physical",
    direct: false,
    seller: null,
    purchaseCaptureUrl: null,
    receiptUrl: null,
    orderNumber: null,
    orderDate: null,
    quizQuestionId: null,
    quizAnswer: null,
    status: "approved",
    rejectTag: null,
    rejectReason: null,
    flaggedShots: [],
    processedBy: null,
    processedAt: new Date("2026-09-01T00:00:00Z"),
    filesPurgedAt: null,
    createdAt: new Date("2026-08-30T00:00:00Z"),
    ...partial,
  };
}

function rulebook(latestApplication: CertApplication): MyRulebook {
  return {
    id: "r",
    name: "책",
    edition: "",
    aliases: [],
    label: "책",
    shortName: "책",
    certRequired: true,
    kind: RULEBOOK_KIND.core,
    categoryId: "c",
    categoryName: "룰",
    supersedesId: null,
    state: CERT_STATE.certified,
    stateAt: new Date("2026-09-01T00:00:00Z"),
    latestApplication,
    revokeReason: null,
    unlockedBy: null,
  };
}

describe("toBookResult", () => {
  it("사진은 서명 URL로, 서명하지 못한 칸은 빈 src로 둔다", () => {
    const result = toBookResult({
      rulebook: rulebook(application({ photoUrls: { front: KEY, back: "other" } })),
      signedUrls: new Map([[KEY, SIGNED]]),
    });
    expect(result.thumbs.map((thumb) => thumb.src)).toEqual([SIGNED, "", null]);
    expect(result.deleted).toBe(false);
  });

  it("보관 기간이 지나 비운 신청은 사진 대신 삭제 안내를 보인다", () => {
    const result = toBookResult({
      rulebook: rulebook(
        application({ photoUrls: {}, filesPurgedAt: new Date("2026-10-02T00:00:00Z") }),
      ),
      signedUrls: new Map(),
    });
    expect(result.thumbs).toEqual([]);
    expect(result.deleted).toBe(true);
  });
});
