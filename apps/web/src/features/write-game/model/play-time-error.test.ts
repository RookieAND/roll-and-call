import { describe, expect, it } from "vitest";

import { PLAY_TIME_ERROR, playTimeError } from "./play-time-error";

describe("playTimeError", () => {
  it("최소만 있으면 통과한다", () => {
    expect(playTimeError({ min: 180, max: null })).toBeNull();
  });
  it("최소 3시간, 최대 5시간은 통과한다", () => {
    expect(playTimeError({ min: 180, max: 300 })).toBeNull();
  });
  it("최소 0은 오류다", () => {
    expect(playTimeError({ min: 0, max: null })?.message).toBe(PLAY_TIME_ERROR.zero);
  });
  it("12시간 10분은 오류다", () => {
    expect(playTimeError({ min: 730, max: null })?.message).toBe(PLAY_TIME_ERROR.tooLong);
  });
  it("최소가 최대보다 길면 오류다", () => {
    expect(playTimeError({ min: 300, max: 180 })).toEqual({
      field: "playMinutes",
      message: PLAY_TIME_ERROR.minOverMax,
    });
  });
});
