import { DISCORD_COLOR } from "@roll-and-call/discord";
import { describe, expect, it } from "vitest";

import { certNoticeResult, type CertNoticeApplication } from "./cert-notice-result";

const application = (overrides: Partial<CertNoticeApplication>): CertNoticeApplication => ({
  status: "pending",
  staffNickname: null,
  rulebookLabel: "크툴루의 부름 7판",
  pendingSync: false,
  ...overrides,
});

describe("certNoticeResult", () => {
  it("한 권 승인은 처리한 운영진과 승인 색, 스레드 한 줄을 낸다", () => {
    const result = certNoticeResult([
      application({ status: "approved", staffNickname: "루키", pendingSync: true }),
    ]);
    expect(result.field.value).toBe("✅ 승인 · 루키");
    expect(result.color).toBe(DISCORD_COLOR.confirmed);
    expect(result.threadLines).toEqual(["✅ 루키님이 크툴루의 부름 7판 인증을 승인했습니다."]);
  });

  it("묶음에 대기가 남으면 색을 바꾸지 않고 새로 결정된 책만 스레드에 남긴다", () => {
    const result = certNoticeResult([
      application({ status: "rejected", staffNickname: "루키", rulebookLabel: "A" }),
      application({
        status: "approved",
        staffNickname: "신님",
        rulebookLabel: "B",
        pendingSync: true,
      }),
      application({ rulebookLabel: "C" }),
    ]);
    expect(result.field.value).toBe("❌ A — 반려 · 루키\n✅ B — 승인 · 신님\n⏳ C — 심사 대기");
    expect(result.color).toBeUndefined();
    expect(result.threadLines).toEqual(["✅ 신님님이 B 인증을 승인했습니다."]);
  });

  it("승인과 반려가 섞여 끝나면 노란색, 철회만 있으면 회색이다", () => {
    expect(
      certNoticeResult([application({ status: "approved" }), application({ status: "rejected" })])
        .color,
    ).toBe(DISCORD_COLOR.waiting);
    expect(certNoticeResult([application({ status: "withdrawn" })]).color).toBe(DISCORD_COLOR.left);
  });
});
