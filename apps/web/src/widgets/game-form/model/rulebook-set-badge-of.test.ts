import { describe, expect, it } from "vitest";

import { CERT_STATE, editionSets, type CertState, type MyRulebook } from "@/entities/rulebook";

import { rulebookSetBadgeOf } from "./rulebook-set-badge-of";

const setWith = ({
  state = null,
  certRequired = true,
}: {
  state?: CertState | null;
  certRequired?: boolean;
}) => {
  const book = {
    id: "인세인",
    name: "인세인",
    label: "인세인",
    shortName: "인세인",
    aliases: [],
    categoryId: "인세인",
    categoryName: "인세인",
    edition: "",
    kind: "core",
    certRequired,
    state,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
  } as unknown as MyRulebook;
  return editionSets([book])[0]!;
};

describe("rulebookSetBadgeOf", () => {
  it("인증 완료·무료 배포", () => {
    expect(rulebookSetBadgeOf(setWith({ state: CERT_STATE.certified }))).toEqual({
      label: "인증 완료",
      colorPalette: "success",
    });
    expect(rulebookSetBadgeOf(setWith({ certRequired: false })).label).toBe("무료 배포");
  });

  it("잠긴 판본은 심사 중·반려됨·미인증을 회색으로", () => {
    expect(rulebookSetBadgeOf(setWith({ state: CERT_STATE.pending }))).toEqual({
      label: "심사 중",
      colorPalette: "gray",
    });
    expect(rulebookSetBadgeOf(setWith({ state: CERT_STATE.rejected })).label).toBe("반려됨");
    expect(rulebookSetBadgeOf(setWith({ state: CERT_STATE.revoked })).label).toBe("미인증");
    expect(rulebookSetBadgeOf(setWith({})).label).toBe("미인증");
  });
});
