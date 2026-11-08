import { Chip } from "@roll-and-call/ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface TagChipProps {
  removeLabel: string;
  children: ReactNode;
  onRemove: () => void;
}

export function TagChip({ removeLabel, children, onRemove }: TagChipProps) {
  return (
    <Chip selected className="h-8.5 gap-050" aria-label={removeLabel} onClick={onRemove}>
      {children}
      <X size={13} aria-hidden />
    </Chip>
  );
}
