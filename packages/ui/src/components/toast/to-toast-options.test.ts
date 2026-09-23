import { expect, test } from "vitest";

import { toToastOptions } from "./to-toast-options";

test("기본 토스트는 4초 뒤 닫힌다", () => {
  expect(toToastOptions()).toMatchObject({ duration: 4000, closeButton: false });
});

test("행동이 붙으면 기본으로 남고 닫기 버튼이 생긴다", () => {
  const onClick = () => {};
  expect(toToastOptions({ action: { label: "되돌리기", onClick } })).toMatchObject({
    duration: Infinity,
    closeButton: true,
    action: { label: "되돌리기", onClick },
  });
});

test("duration을 주면 행동이 있어도 그 값을 쓴다", () => {
  expect(
    toToastOptions({ duration: 6000, action: { label: "되돌리기", onClick: () => {} } }),
  ).toMatchObject({ duration: 6000, closeButton: false });
});
