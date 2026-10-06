import { describe, expect, it } from "vitest";

import { cancelSentence } from "./cancel-sentence";
import type { SessionGame } from "./session-card-model";

const game = (cancelKind: string, cancelReason: string | null = null) =>
  ({ cancelKind, cancelReason }) as SessionGame;

describe("cancelSentence", () => {
  it("취소 종류마다 문장이 다르다", () => {
    expect(cancelSentence(game("staff"))).toBe("운영진이 취소한 구인입니다");
    expect(cancelSentence(game("auto"))).toBe("GM이 서버를 나가 취소되었습니다");
    expect(cancelSentence(game("min_players_unmet"))).toBe(
      "최소 인원이 모이지 않아 취소되었습니다",
    );
  });

  it("GM 취소는 GM이 쓴 사유를 그대로 보여 준다", () => {
    expect(cancelSentence(game("gm", "GM 사정"))).toBe("GM 사정");
  });
});
