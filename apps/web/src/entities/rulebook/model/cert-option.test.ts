import { describe, expect, it } from "vitest";

import { CERT_OPTION, certOption } from "./cert-option";
import { CERT_STATE } from "./cert-state";
import type { MyRulebook } from "./to-my-rulebooks";

const book = (id: string, overrides: Partial<MyRulebook>) =>
  ({
    id,
    shortName: id,
    categoryId: "insane",
    edition: "",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("certOption", () => {
  it("기본 룰북이 심사 중이면 서플리먼트를 함께 낼 수 있다", () => {
    const core = book("인세인", { state: CERT_STATE.pending, stateAt: new Date() });
    const supplement = book("인세인 2", { kind: "supplement" });
    expect(certOption(supplement, [core, supplement])).toMatchObject({
      type: CERT_OPTION.pick,
      note: "기본 룰북 결과가 나온 뒤에 확인합니다",
    });
  });

  it("기본 룰북을 아직 안 냈으면 그 기본 룰북이 먼저 필요하다", () => {
    const core = book("마기카로기아", {});
    const supplement = book("황혼선서", { kind: "supplement" });
    expect(certOption(supplement, [core, supplement])).toMatchObject({
      type: CERT_OPTION.needsCore,
      missing: [core],
    });
  });

  it("기본 룰북을 가졌으면 서플리먼트를 고른다", () => {
    const core = book("마기카로기아", { state: CERT_STATE.certified, stateAt: new Date() });
    const supplement = book("황혼선서", { kind: "supplement" });
    expect(certOption(supplement, [core, supplement]).type).toBe(CERT_OPTION.pick);
  });

  it("무료 배포·신판으로 열린 책은 고를 수 없다", () => {
    expect(certOption(book("F", { certRequired: false }), []).type).toBe(CERT_OPTION.free);
    const newer = book("7", { edition: "7판", state: CERT_STATE.certified, stateAt: new Date() });
    expect(certOption(book("6", { unlockedBy: newer }), [newer]).note).toBe(
      "7판 인증으로 함께 열립니다",
    );
  });
});
