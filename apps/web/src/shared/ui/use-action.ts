"use client";

import { unstable_rethrow } from "next/navigation";
import { useTransition } from "react";

import type { ActionResult } from "@/shared/api";

import { handleActionResult, type ActionHandlers } from "./handle-action-result";

export function useAction() {
  const [pending, startTransition] = useTransition();

  function run<Result extends ActionResult>(
    action: () => Promise<Result>,
    handlers: ActionHandlers<Result> = {},
  ) {
    startTransition(async () => {
      let result: Result;
      try {
        result = await action();
      } catch (error) {
        // 서버 redirect()로 끝난 액션도 성공이다. 토스트를 띄우고 이동은 Next에 맡긴다.
        try {
          unstable_rethrow(error);
        } catch {
          handlers.onSuccess?.({} as Result);
        }
        throw error;
      }
      handleActionResult(result, handlers);
    });
  }

  return { pending, run };
}
