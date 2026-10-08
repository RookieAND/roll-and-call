import { expect, test } from "vitest";

import { toToastOptions } from "./to-toast-options";

test("기본 토스트는 3초 뒤 닫힌다", () => {
  expect(toToastOptions()).toMatchObject({ duration: 3000 });
});

test("duration을 주면 그 값을 쓴다", () => {
  expect(toToastOptions({ duration: 6000 })).toMatchObject({ duration: 6000 });
});
