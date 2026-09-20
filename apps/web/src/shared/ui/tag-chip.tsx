import { Chip } from "@trpg/ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface TagChipProps {
  label: string;
  children: ReactNode;
  onRemove: () => void;
}

export function TagChip({ label, children, onRemove }: TagChipProps) {
  return (
    <Chip selected className="h-8.5 gap-050" aria-label={`${label} 삭제`} onClick={onRemove}>
      {children}
      <X size={13} aria-hidden />
    </Chip>
  );
}
