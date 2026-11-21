import { Sheet, cn } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface SheetRadioItemProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

export function SheetRadioItem({ selected, onSelect, children }: SheetRadioItemProps) {
  return (
    <Sheet.Item
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "rounded-400 border-b-0 px-150",
        selected && "bg-tinted-bg font-bold text-tinted-ink hover:bg-tinted-bg",
      )}
    >
      {children}
      {selected && <Check size={16} aria-hidden />}
    </Sheet.Item>
  );
}
