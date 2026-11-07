import { expect, test } from "vitest";

import { toToastOptions } from "./to-toast-options";

test("종류마다 기본 표시 시간이 다르다", () => {
  expect(toToastOptions("success")).toMatchObject({ duration: 3000, closeButton: false });
  expect(toToastOptions("info")).toMatchObject({ duration: 3000, closeButton: false });
  expect(toToastOptions("warning")).toMatchObject({ duration: 4000, closeButton: false });
  expect(toToastOptions("danger")).toMatchObject({ duration: 5000, closeButton: true });
});

test("duration을 주면 그 값을 쓴다", () => {
  expect(toToastOptions("danger", { duration: 6000 })).toMatchObject({ duration: 6000 });
});

test("duration 0이나 action이 있으면 닫힐 때까지 남고 닫기 버튼이 붙는다", () => {
  const action = { label: "되돌리기", onClick: () => {} };
  expect(toToastOptions("success", { duration: 0 })).toMatchObject({
    duration: Infinity,
    closeButton: true,
  });
  expect(toToastOptions("success", { action })).toMatchObject({
    duration: Infinity,
    closeButton: true,
  });
});
