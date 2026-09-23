import { expect, test } from "vitest";

import { cn } from "./cn";

// twMerge는 기본 스케일에 없는 text-*를 글자색으로 본다. 등록해 두지 않으면
// 뒤에 오는 색이 앞의 크기를 밀어내 크기가 통째로 사라진다.
test("커스텀 글자 크기는 색과 함께 살아남는다", () => {
  expect(cn("text-body4", "text-gray-900")).toBe("text-body4 text-gray-900");
});

test("글자 크기끼리는 뒤에 온 것만 남는다", () => {
  expect(cn("text-heading1", "text-body3")).toBe("text-body3");
});

test("글자 색끼리는 뒤에 온 것만 남는다", () => {
  expect(cn("text-gray-500", "text-danger-600")).toBe("text-danger-600");
});

test("거짓값은 떨어져 나간다", () => {
  expect(cn("p-100", false && "hidden", undefined, ["gap-200"])).toBe("p-100 gap-200");
});
