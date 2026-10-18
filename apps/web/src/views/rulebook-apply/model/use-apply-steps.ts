"use client";

import { useEffect, useRef, useState } from "react";

import { APPLY_MODE, type ApplyMode } from "./apply-mode";

interface UseApplyStepsInput {
  initialMode: ApplyMode | null;
}

// 신청 방식을 고를 때 기록 한 칸을 쌓아, 폰의 뒤로 가기가 신청 화면을 떠나지 않고 방식 선택으로 돌아가게 한다.
export function useApplySteps({ initialMode }: UseApplyStepsInput) {
  const [mode, setMode] = useState(initialMode);
  const pushed = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      if (!pushed.current) return;
      pushed.current = false;
      setMode(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const chooseMode = (next: ApplyMode) => {
    window.history.pushState(window.history.state, "");
    pushed.current = true;
    setMode(next);
  };

  const restoreBulk = () => setMode(APPLY_MODE.bulk);

  return { mode, chooseMode, restoreBulk };
}
