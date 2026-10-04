import { describe, expect, it } from "vitest";

import { runActionSubmit } from "./run-action-submit";

function recorder() {
  const values: boolean[] = [];
  return { values, setNetworkError: (value: boolean) => values.push(value) };
}

describe("useActionSubmit의 실행 규칙(runActionSubmit)", () => {
  it("성공 결과를 돌려준다", async () => {
    const { values, setNetworkError } = recorder();
    const result = await runActionSubmit({ run: async () => ({ ok: true }), setNetworkError });
    expect(result).toEqual({ ok: true });
    expect(values).toEqual([false]);
  });

  it("업무 실패는 그대로 돌려주고 네트워크 오류로 보지 않는다", async () => {
    const { values, setNetworkError } = recorder();
    const failure = { ok: false, conflict: null };
    const result = await runActionSubmit({ run: async () => failure, setNetworkError });
    expect(result).toBe(failure);
    expect(values).toEqual([false]);
  });

  it("예외면 networkError를 켜고 다시 실행하면 끈다", async () => {
    const { values, setNetworkError } = recorder();
    const failed = await runActionSubmit({
      run: () => Promise.reject(new TypeError("Failed to fetch")),
      setNetworkError,
    });
    expect(failed).toBeUndefined();
    expect(values).toEqual([false, true]);
    await runActionSubmit({ run: async () => ({ ok: true }), setNetworkError });
    expect(values).toEqual([false, true, false]);
  });
});
