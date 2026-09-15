"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { ActionResult } from "@/shared/api";

import { handleActionResult, type ActionHandlers } from "./handle-action-result";

export function useAction() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run<Result extends ActionResult>(
    action: () => Promise<Result>,
    handlers: ActionHandlers<Result> = {},
  ) {
    startTransition(async () => {
      const result = await action();
      if (handleActionResult(result, handlers) && result.redirect) router.push(result.redirect);
    });
  }

  return { pending, run };
}
