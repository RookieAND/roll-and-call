import { describe, expect, it } from "vitest";

import { GAME_STATUS } from "@/shared/lib";

import { capacityParts } from "./capacity-parts";
import { RECRUIT_METHOD } from "./recruit-method";

const base = {
  status: GAME_STATUS.recruiting,
  recruitMethod: RECRUIT_METHOD.firstCome,
  confirmed: 2,
  waiting: 0,
  maxPlayers: 4,
};
const texts = (input: Parameters<typeof capacityParts>[0]) =>
  capacityParts(input).map((part) => part.text);

describe("capacityParts", () => {
  it("선착순은 확정된 자리를 센다", () => {
    expect(texts(base)).toEqual(["선착순", "확정 2", "정원 4"]);
  });

  it("대기가 있으면 뒤에 붙는다", () => {
    expect(texts({ ...base, waiting: 3 })).toEqual(["선착순", "확정 2", "정원 4", "대기 3"]);
  });

  it("추첨은 뽑기 전이라 확정 대신 신청 수를 센다", () => {
    expect(texts({ ...base, recruitMethod: RECRUIT_METHOD.lottery, waiting: 3 })).toEqual([
      "추첨",
      "신청 5",
      "정원 4",
    ]);
  });

  it("마감된 글은 방식과 정원만 남긴다", () => {
    expect(texts({ ...base, status: GAME_STATUS.closed, waiting: 3 })).toEqual([
      "선착순",
      "정원 4",
    ]);
    expect(texts({ ...base, status: GAME_STATUS.full })).toEqual(["선착순", "정원 4"]);
  });

  it("셀 수 있는 값만 강조한다", () => {
    expect(
      capacityParts(base)
        .filter((part) => part.emphasis)
        .map((part) => part.text),
    ).toEqual(["확정 2"]);
  });
});
