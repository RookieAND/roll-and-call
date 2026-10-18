import type { CertApplication } from "@roll-and-call/database";
import { describe, expect, it } from "vitest";

import { CERT_STATE, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

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
    photoUrls: { front: KEY, back: KEY },
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
    discardedAt: null,
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
    rejection: null,
    unlockedBy: null,
  };
}

describe("toBookResult", () => {
  it("사진은 서명 URL로, 서명하지 못한 칸은 빈 src로 둔다", () => {
    const result = toBookResult({
      rulebook: rulebook(application({ photoUrls: { front: KEY, back: "other" } })),
      signedUrls: new Map([[KEY, SIGNED]]),
    });
    expect(result.thumbs.map((thumb) => thumb.src)).toEqual([SIGNED, ""]);
    expect(result.deleted).toBe(false);
  });

  it("묶음으로 신청한 사진은 올린 순서대로 사진 번호를 붙인다", () => {
    const result = toBookResult({
      rulebook: rulebook(
        application({ groupId: "g", photoUrls: { front: KEY, back: KEY, extra1: KEY } }),
      ),
      signedUrls: new Map([[KEY, SIGNED]]),
    });
    expect(result.thumbs.map((thumb) => thumb.label)).toEqual(["사진 1", "사진 2", "사진 3"]);
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

  it("운영진이 직접 인증한 책은 그 전 반려 신청의 형식·신청일·사진을 섞지 않는다", () => {
    const result = toBookResult({
      rulebook: rulebook(application({ status: "rejected", flaggedShots: ["back"] })),
      signedUrls: new Map([[KEY, SIGNED]]),
    });
    expect(result.mode).toBe("운영진 인증");
    expect(result.dates).toEqual([{ label: "승인", value: "2026.09.01" }]);
    expect(result.thumbs).toEqual([]);
    expect(result.badge?.label).toBe("승인됨");
  });

  it("반려 요약과 다른 사유 전문만 자세한 사유로 보인다", () => {
    const rejected = {
      ...rulebook(
        application({
          status: "rejected",
          rejectTag: "사진이 잘렸거나 흐립니다",
          rejectReason: "책등 제목이 읽히지 않습니다.",
        }),
      ),
      state: CERT_STATE.rejected,
    };
    const result = toBookResult({ rulebook: rejected, signedUrls: new Map() });
    expect(result.memo).toBe("책등 제목이 읽히지 않습니다.");
    expect(result.discardable).toBe(true);
  });
});
