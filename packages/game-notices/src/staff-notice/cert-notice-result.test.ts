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
  it("한 권 승인은 결과와 처리한 운영진 칸, 승인 색을 낸다", () => {
    const result = certNoticeResult([application({ status: "approved", staffNickname: "루키" })]);
    expect(result.fields.map(({ value }) => value)).toEqual(["✅ 승인", "루키"]);
    expect(result.color).toBe(DISCORD_COLOR.confirmed);
  });

  it("여러 권이 모두 같은 결과면 전체 승인·전체 반려로 적는다", () => {
    const approved = certNoticeResult([
      application({ status: "approved", staffNickname: "루키" }),
      application({ status: "approved", staffNickname: "루키" }),
    ]);
    expect(approved.fields.map(({ value }) => value)).toEqual(["✅ 전체 승인", "루키"]);
    const rejected = certNoticeResult([
      application({ status: "rejected", staffNickname: "루키" }),
      application({ status: "rejected", staffNickname: "신님" }),
    ]);
    expect(rejected.fields[0]?.value).toBe("❌ 전체 반려");
  });

  it("일부만 결정됐거나 갈리면 책마다 적고 대기가 남으면 색을 바꾸지 않는다", () => {
    const result = certNoticeResult([
      application({ status: "rejected", staffNickname: "루키", rulebookLabel: "A" }),
      application({ status: "approved", staffNickname: "신님", rulebookLabel: "B" }),
      application({ rulebookLabel: "C" }),
    ]);
    expect(result.fields.map(({ value }) => value)).toEqual([
      "❌ A — 반려\n✅ B — 승인\n⏳ C — 심사 대기",
      "A — 루키\nB — 신님",
    ]);
    expect(result.color).toBeUndefined();
  });

  it("승인과 반려가 섞여 끝나면 노란색, 철회만 있으면 회색이다", () => {
    expect(
      certNoticeResult([application({ status: "approved" }), application({ status: "rejected" })])
        .color,
    ).toBe(DISCORD_COLOR.waiting);
    expect(certNoticeResult([application({ status: "withdrawn" })]).color).toBe(DISCORD_COLOR.left);
  });
});
