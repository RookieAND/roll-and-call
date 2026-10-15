"use client";

import { unstable_rethrow } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { joinServer, type JoinServerResult } from "../api/join-server";
import { JOIN_STATUS, type JoinStatus } from "./join-status";

// 들어오자마자 가입을 시도한다. 멤버면 서버가 redirect하고, 아니면 그 이유를 상태로 남긴다.
export function useJoinServer({ next }: { next: string }) {
  const [status, setStatus] = useState<JoinStatus>(JOIN_STATUS.checking);
  const [, startTransition] = useTransition();

  const check = useCallback(() => {
    startTransition(async () => {
      let result: JoinServerResult;
      try {
        result = await joinServer({ next });
      } catch (error) {
        unstable_rethrow(error);
        setStatus(JOIN_STATUS.failed);
        return;
      }
      setStatus(result.notGuildMember ? JOIN_STATUS.denied : JOIN_STATUS.failed);
    });
  }, [next]);

  useEffect(() => check(), [check]);

  function retry() {
    setStatus(JOIN_STATUS.checking);
    check();
  }

  return { status, retry };
}
