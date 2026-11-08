import { Chip } from "@roll-and-call/ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface NoticeTagChipProps {
  removeLabel: string;
  children: ReactNode;
  onRemove: () => void;
}

// 트리거는 "조심해서 읽으라"는 뜻이라 장르·플랫폼과 다른 결을 쓴다.
export function NoticeTagChip({ removeLabel, children, onRemove }: NoticeTagChipProps) {
  return (
    <Chip tone="warning" className="h-8.5 gap-050" aria-label={removeLabel} onClick={onRemove}>
      {children}
      <X size={13} aria-hidden />
    </Chip>
  );
}
