import { Chip } from "@trpg/ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface NoticeTagChipProps {
  label: string;
  children: ReactNode;
  onRemove: () => void;
}

// 트리거는 "조심해서 읽으라"는 뜻이라 장르·플랫폼과 다른 결을 쓴다.
export function NoticeTagChip({ label, children, onRemove }: NoticeTagChipProps) {
  return (
    <Chip tone="notice" className="h-8.5 gap-050" aria-label={`${label} 삭제`} onClick={onRemove}>
      {children}
      <X size={13} aria-hidden />
    </Chip>
  );
}
