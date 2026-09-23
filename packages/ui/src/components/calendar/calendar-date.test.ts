import { expect, test } from "vitest";

import { daysInMonth } from "./days-in-month";
import { firstWeekday } from "./first-weekday";
import { toDateKey } from "./to-date-key";

test("달마다 날 수가 맞는다", () => {
  expect(daysInMonth(2026, 1)).toBe(31);
  expect(daysInMonth(2026, 4)).toBe(30);
  expect(daysInMonth(2026, 12)).toBe(31);
});

test("윤년 2월은 29일이다", () => {
  expect(daysInMonth(2024, 2)).toBe(29);
  expect(daysInMonth(2026, 2)).toBe(28);
  expect(daysInMonth(2000, 2)).toBe(29);
  expect(daysInMonth(1900, 2)).toBe(28);
});

test("1일의 요일은 일요일이 0이다", () => {
  expect(firstWeekday(2026, 9)).toBe(2);
  expect(firstWeekday(2026, 2)).toBe(0);
});

// 로컬 시간으로 세면 서머타임이나 UTC-9 같은 곳에서 하루가 밀린다.
test("요일과 날 수는 표준시대와 무관하다", () => {
  expect(firstWeekday(2026, 3)).toBe(0);
  expect(daysInMonth(2026, 3)).toBe(31);
});

test("키는 늘 두 자리로 채운다", () => {
  expect(toDateKey(2026, 9, 3)).toBe("2026-09-03");
  expect(toDateKey(2026, 12, 25)).toBe("2026-12-25");
});
