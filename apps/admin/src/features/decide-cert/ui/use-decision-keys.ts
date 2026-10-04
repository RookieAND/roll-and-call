"use client";

import { useEffect } from "react";

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

interface DecisionKeys {
  enabled: boolean;
  rejecting: boolean;
  canApprove: boolean;
  onReject: () => void;
  onCancelReject: () => void;
  onApprove: () => void;
  // 1·2·3 → 그 순서 사진의 확인 항목
  onCheck: (index: number) => void;
}

// R 반려 중으로, Enter 승인(입력 칸 밖에서만), 반려 중 Esc는 반려 취소. 확대 창이 열려 있거나 처리 중이면 enabled가 false다.
export function useDecisionKeys(keys: DecisionKeys) {
  useEffect(() => {
    if (!keys.enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape" && keys.rejecting) {
        keys.onCancelReject();
        return;
      }
      if (isTyping(event.target)) return;
      if (event.key.toLowerCase() === "r" && !keys.rejecting) keys.onReject();
      if (event.key === "Enter" && !keys.rejecting && keys.canApprove) {
        const onCheckbox =
          event.target instanceof HTMLElement && event.target.getAttribute("role") === "checkbox";
        if (event.target !== document.body && !onCheckbox) return;
        event.preventDefault();
        keys.onApprove();
      }
      const shotIndex = ["1", "2", "3"].indexOf(event.key);
      if (shotIndex !== -1) keys.onCheck(shotIndex);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}
