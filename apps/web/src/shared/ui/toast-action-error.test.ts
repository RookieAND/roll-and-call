import { toast } from "@roll-and-call/ui";
import { afterEach, expect, test, vi } from "vitest";

import { toastActionError } from "./toast-action-error";

vi.mock("@roll-and-call/ui", () => ({ toast: { danger: vi.fn(), warning: vi.fn() } }));

afterEach(() => vi.clearAllMocks());

test("막힌 행동은 warning으로 띄운다", () => {
  toastActionError({ error: "시작한 세션은 고칠 수 없습니다." });
  expect(toast.warning).toHaveBeenCalledWith("시작한 세션은 고칠 수 없습니다.");
  expect(toast.danger).not.toHaveBeenCalled();
});

test("failed가 붙은 처리 실패는 danger로 띄운다", () => {
  toastActionError({ error: "진행 상황을 저장하지 못했습니다.", failed: true });
  expect(toast.danger).toHaveBeenCalledWith("진행 상황을 저장하지 못했습니다.");
});
