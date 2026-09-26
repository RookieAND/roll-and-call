import { describe, expect, it } from "vitest";

import { CERT_STATE } from "./cert-state";
import { editionSets } from "./edition-sets";
import { RULE_GATE, ruleGate } from "./rule-gate";
import type { MyRulebook, MyRulebooks } from "./to-my-rulebooks";

const NOW = new Date("2026-10-20T00:00:00+09:00");
const PASSED = new Date("2026-10-08T00:00:00+09:00");
const COMING = new Date("2026-10-28T00:00:00+09:00");

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    shortName: id,
    categoryId: "dx",
    categoryName: "더블크로스",
    edition: "3rd",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

const data = (rulebooks: MyRulebook[], enforcementDate: Date | null) =>
  ({ rulebooks, sets: editionSets(rulebooks), enforcementDate }) as MyRulebooks;

describe("ruleGate", () => {
  it("적용일 뒤에는 기본 룰북이 모자란 판본을 막고 남은 책을 알려 준다", () => {
    const rulebooks = [book("1권", { state: CERT_STATE.certified }), book("2권")];
    const records = data(rulebooks, PASSED);
    expect(ruleGate(records.sets[0]!, records, NOW)).toMatchObject({
      type: RULE_GATE.blocked,
      lines: ["기본 룰북 2권 중 1권이 남았습니다.", "남은 책을 인증하면 열 수 있습니다."],
      action: { label: "남은 책 인증하기", href: "/me/rulebooks/apply?rulebook=2%EA%B6%8C" },
    });
  });

  it("적용일 전에는 알려만 준다", () => {
    const records = data([book("1권")], COMING);
    expect(ruleGate(records.sets[0]!, records, NOW).type).toBe(RULE_GATE.notice);
  });

  it("신판 인증으로 구판을 연다", () => {
    const newer = book("7", { categoryId: "coc", edition: "7판", state: CERT_STATE.certified });
    const older = book("6", { categoryId: "coc", edition: "6판", unlockedBy: newer });
    const records = data([newer, older], PASSED);
    const olderSet = records.sets.find((set) => set.edition === "6판")!;
    expect(ruleGate(olderSet, records, NOW)).toMatchObject({
      type: RULE_GATE.open,
      okText: "7판 인증으로 열 수 있습니다",
    });
  });

  it("다른 판본만 인증했으면 이 판본은 따로 인증해야 한다고 알린다", () => {
    const older = book("6", { categoryId: "coc", edition: "6판", state: CERT_STATE.certified });
    const newer = book("7", { categoryId: "coc", edition: "7판" });
    const records = data([older, newer], PASSED);
    const newerSet = records.sets.find((set) => set.edition === "7판")!;
    expect(ruleGate(newerSet, records, NOW).lines[0]).toBe("7판은 따로 인증이 필요합니다.");
  });
});
