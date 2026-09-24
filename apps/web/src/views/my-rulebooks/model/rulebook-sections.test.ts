import { describe, expect, it } from "vitest";

import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { rulebookSections } from "./rulebook-sections";

const day = (value: number) => new Date(Date.UTC(2026, 8, value));
const rulebook = (label: string, state: MyRulebook["state"], at: number, certRequired = true) =>
  ({ id: label, label, state, stateAt: state ? day(at) : null, certRequired }) as MyRulebook;

describe("rulebookSections", () => {
  const sections = rulebookSections({
    enforcementDate: null,
    rulebooks: [
      rulebook("A", CERT_STATE.certified, 1),
      rulebook("B", CERT_STATE.certified, 5),
      rulebook("C", CERT_STATE.pending, 3),
      rulebook("D", CERT_STATE.rejected, 2),
      rulebook("사타스페", null, 0, false),
      rulebook("마녀의 차 모임", null, 0, false),
      rulebook("E", CERT_STATE.revoked, 4),
    ],
    requests: [{ id: "r", label: "네크로니카", createdAt: day(4) }],
  });

  it("인증일 최신순", () => {
    expect(sections.usable.map((item) => item.label)).toEqual(["B", "A"]);
  });

  it("확인 중과 추가 요청은 신청일 최신순으로 섞는다", () => {
    expect(sections.waiting.map((item) => item.kind)).toEqual(["requested", "pending"]);
    expect(sections.rejected.map((item) => item.label)).toEqual(["D"]);
  });
});
