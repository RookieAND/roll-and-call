import { describe, expect, it } from "vitest";

import { TRIAL_GAME_ID, TRIAL_KIND } from "./trial-kind";
import { screenOfPath, TRIAL_SCREEN } from "./trial-screen";

describe("체험 화면 주소", () => {
  it("목록과 체험 구인 상세만 열린다", () => {
    expect(screenOfPath("/games")).toEqual({ name: TRIAL_SCREEN.list });
    expect(screenOfPath(`/games/${TRIAL_GAME_ID[TRIAL_KIND.lottery]}`)).toEqual({
      name: TRIAL_SCREEN.detail,
      kind: TRIAL_KIND.lottery,
    });
  });

  it("실제 구인이나 다른 화면은 열리지 않는다", () => {
    expect(screenOfPath("/games/0b8c2f0e-real")).toBeNull();
    expect(screenOfPath("/me")).toBeNull();
    expect(screenOfPath("/games/trial-game-first-come/manage")).toBeNull();
  });
});
