"use client";

import { unstable_rethrow } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { joinServer, type JoinServerResult } from "../api/join-server";
import type { JoinStatus } from "./join-status";

// 들어오자마자 가입을 시도한다. 멤버면 서버가 redirect하고, 아니면 그 이유를 상태로 남긴다.
export function useJoinServer({ next }: { next: string }) {
  const [status, setStatus] = useState<JoinStatus>("checking");
  const [, startTransition] = useTransition();

  const check = useCallback(
    (recheck: boolean) => {
      startTransition(async () => {
        let result: JoinServerResult;
        try {
          result = await joinServer({ next, recheck });
        } catch (error) {
          unstable_rethrow(error);
          setStatus("failed");
          return;
        }
        setStatus(result.notGuildMember ? "denied" : "failed");
      });
    },
    [next],
  );

  useEffect(() => check(false), [check]);

  function retry() {
    setStatus("checking");
    check(false);
  }

  function recheck() {
    setStatus("checking");
    check(true);
  }

  return { status, retry, recheck };
}
