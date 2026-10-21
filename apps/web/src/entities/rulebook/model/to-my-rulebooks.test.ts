import type { RulebookRecords } from "@roll-and-call/database/certifications";
import { describe, expect, it } from "vitest";

import { CERT_OPTION, certOption } from "./cert-option";
import { ruleSetOf } from "./rule-set-of";
import { SUPPLEMENT_OPTION_STATE, supplementOptions } from "./supplement-options";
import { toMyRulebooks } from "./to-my-rulebooks";

const catalogBook = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  name: id,
  edition: "구판",
  aliases: [],
  certRequired: true,
  kind: "supplement",
  categoryId: "coc",
  categoryName: "크툴루",
  supersedesId: null,
  ...overrides,
});

function recordsOf({ certified }: { certified: string[] }) {
  return {
    catalog: [
      catalogBook("core6", { kind: "core" }),
      catalogBook("core7", { kind: "core", edition: "신판", supersedesId: "core6" }),
      catalogBook("sup-old"),
      catalogBook("sup-new", { edition: "신판" }),
    ],
    certificationRows: certified.map((rulebookId) => ({
      rulebookId,
      approvedAt: new Date(),
      revokedAt: null,
    })),
    applicationRows: [],
    requestRows: [],
    pendingRequestNames: [],
    recentRulebookIds: [],
    enforcementDate: null,
    sanction: null,
  } as unknown as RulebookRecords;
}

describe("구판 서플리먼트 상속", () => {
  it("신판 인증으로 구판 기본 룰북이 열리면 구판 서플리먼트도 함께 열린다", () => {
    const { rulebooks } = toMyRulebooks(recordsOf({ certified: ["core7"] }));
    const byId = (id: string) => rulebooks.find((book) => book.id === id)!;
    expect(byId("sup-old").unlockedBy?.id).toBe("core7");
    expect(byId("sup-new").unlockedBy).toBeNull();
    expect(certOption({ rulebook: byId("sup-old"), rulebooks })).toMatchObject({
      type: CERT_OPTION.unlocked,
      note: "신판 인증으로 함께 열립니다",
    });
  });

  it("신판 세트의 서플리먼트 목록에 구판 서플리먼트가 한 번만 열린 채로 든다", () => {
    const myRulebooks = toMyRulebooks(recordsOf({ certified: ["core6", "core7"] }));
    const set = ruleSetOf({ myRulebooks, rulebookId: "core7" })!;
    expect(supplementOptions(set, { enforced: true })).toEqual([
      { id: "sup-old", name: "sup-old", state: SUPPLEMENT_OPTION_STATE.open },
      { id: "sup-new", name: "sup-new", state: SUPPLEMENT_OPTION_STATE.locked },
    ]);
  });

  it("구판만 가진 사람의 구판 서플리먼트는 직접 인증해야 열린다", () => {
    const myRulebooks = toMyRulebooks(recordsOf({ certified: ["core6"] }));
    const set = ruleSetOf({ myRulebooks, rulebookId: "core6" })!;
    expect(supplementOptions(set, { enforced: true })).toEqual([
      { id: "sup-old", name: "sup-old", state: SUPPLEMENT_OPTION_STATE.locked },
    ]);
  });
});
