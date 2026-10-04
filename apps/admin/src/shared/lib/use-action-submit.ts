"use client";

import { useState, useTransition } from "react";

import { runActionSubmit } from "./run-action-submit";

// 네트워크 오류면 모달과 입력을 그대로 두고 networkError만 켠다(D296). 결과가 undefined면 예외였다.
export function useActionSubmit<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [pending, startTransition] = useTransition();
  const [networkError, setNetworkError] = useState(false);
  const submit = (...args: Args) =>
    new Promise<Result | undefined>((resolve) => {
      startTransition(async () => {
        resolve(await runActionSubmit({ run: () => action(...args), setNetworkError }));
      });
    });
  return { pending, networkError, submit };
}
