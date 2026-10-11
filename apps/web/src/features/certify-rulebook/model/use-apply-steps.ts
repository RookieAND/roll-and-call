"use client";

import { useEffect, useRef, useState } from "react";

import { APPLY_MODE, type ApplyMode } from "./apply-mode";

type StepKind = "mode" | "category";

interface UseApplyStepsInput {
  initialMode: ApplyMode | null;
  initialCategoryId: string | null;
}

// 신청 방식과 룰을 고를 때마다 기록 한 칸을 쌓아, 폰의 뒤로 가기가 신청 화면을 떠나지 않고 한 단계씩 돌아가게 한다.
export function useApplySteps({ initialMode, initialCategoryId }: UseApplyStepsInput) {
  const [mode, setMode] = useState(initialMode);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const stack = useRef<StepKind[]>([]);

  useEffect(() => {
    const onPopState = () => {
      const popped = stack.current.pop();
      if (popped === "category") setCategoryId(null);
      if (popped === "mode") setMode(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const push = (kind: StepKind) => {
    window.history.pushState(window.history.state, "");
    stack.current.push(kind);
  };

  const chooseMode = (next: ApplyMode) => {
    push("mode");
    setMode(next);
  };

  const openCategory = (id: string) => {
    push("category");
    setCategoryId(id);
  };

  const closeCategory = () => {
    if (stack.current.at(-1) === "category") {
      window.history.back();
      return;
    }
    setCategoryId(null);
  };

  const restoreBulk = () => setMode(APPLY_MODE.bulk);

  return { mode, categoryId, chooseMode, openCategory, closeCategory, restoreBulk };
}
