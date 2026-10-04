"use client";

import { useQueryClient } from "@tanstack/react-query";
import { unstable_rethrow } from "next/navigation";
import { useTransition } from "react";

import { NAV_BADGES_QUERY_ROOT, type ActionResult } from "@/shared/api";

import { handleActionResult, type ActionHandlers } from "./handle-action-result";

export function useAction() {
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  function run<Result extends ActionResult>(
    action: () => Promise<Result>,
    handlers: ActionHandlers<Result> = {},
  ) {
    // 액션이 할 일·알림을 바꿨을 수 있어 하단 탭 점을 다시 묻는다.
    const onSuccess = (result: Result) => {
      void queryClient.invalidateQueries({ queryKey: [NAV_BADGES_QUERY_ROOT] });
      handlers.onSuccess?.(result);
    };
    startTransition(async () => {
      let result: Result;
      try {
        result = await action();
      } catch (error) {
        // 서버 redirect()로 끝난 액션도 성공이다. 토스트를 띄우고 이동은 Next에 맡긴다.
        try {
          unstable_rethrow(error);
        } catch {
          onSuccess({} as Result);
        }
        throw error;
      }
      handleActionResult({ result, ...handlers, onSuccess });
    });
  }

  return { pending, run };
}
