import { describe, expect, it } from "vitest";

import { GAME_STATUS } from "@/shared/lib";

import { RECRUIT_METHOD } from "./recruit-method";
import { seatCount } from "./seat-count";

const base = {
  status: GAME_STATUS.recruiting,
  recruitMethod: RECRUIT_METHOD.firstCome,
  confirmed: 2,
  waiting: 0,
  maxPlayers: 4,
  ended: false,
};
const texts = (input: Parameters<typeof seatCount>[0]) => seatCount(input).map((cell) => cell.text);

describe("seatCount", () => {
  it("선착순 자리 있음", () => {
    expect(texts(base)).toEqual(["선착순", "확정 2/4"]);
  });

  it("선착순 정원 참 · 대기 받음", () => {
    expect(texts({ ...base, status: GAME_STATUS.confirmed, confirmed: 4, waiting: 2 })).toEqual([
      "선착순",
      "확정 4/4",
      "대기 2",
    ]);
  });

  it("선착순 정원 참 · 대기 안 받음", () => {
    expect(texts({ ...base, status: GAME_STATUS.full, confirmed: 4 })).toEqual([
      "선착순",
      "확정 4/4",
    ]);
  });

  it("추첨 접수 중은 신청 수와 정원", () => {
    expect(
      texts({ ...base, recruitMethod: RECRUIT_METHOD.lottery, confirmed: 0, waiting: 7 }),
    ).toEqual(["추첨", "신청 7", "정원 4"]);
  });

  it("추첨 마감 뒤는 정원만", () => {
    expect(
      texts({ ...base, recruitMethod: RECRUIT_METHOD.lottery, status: GAME_STATUS.closed }),
    ).toEqual(["추첨", "정원 4"]);
  });

  it("기한 지남 · 정원 미달은 확정을 흐리게", () => {
    const cells = seatCount({ ...base, status: GAME_STATUS.closed });
    expect(cells.map((cell) => cell.text)).toEqual(["선착순", "확정 2/4"]);
    expect(cells[1]!.tone).toBe("plain");
  });

  it("세션이 끝나면 참여 수", () => {
    expect(texts({ ...base, status: GAME_STATUS.closed, ended: true })).toEqual([
      "선착순",
      "참여 2",
    ]);
  });

  it("칸은 3개를 넘지 않는다", () => {
    expect(
      seatCount({ ...base, status: GAME_STATUS.confirmed, confirmed: 4, waiting: 9 }).length,
    ).toBeLessThanOrEqual(3);
  });
});
