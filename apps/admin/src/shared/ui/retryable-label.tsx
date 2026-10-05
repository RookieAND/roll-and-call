import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

interface RetryableLabelProps {
  failed: boolean;
  children: ReactNode;
}

// 네트워크 오류 뒤 확정 버튼은 아이콘 + 「다시 시도」로 라벨만 바뀐다.
export function RetryableLabel({ failed, children }: RetryableLabelProps) {
  if (!failed) return children;
  return (
    <>
      <RotateCcw size={16} aria-hidden />
      다시 시도
    </>
  );
}
