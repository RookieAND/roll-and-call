import { RadioGroup, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface OptionListProps {
  labelledBy: string;
  value: string | null;
  disabled: boolean;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

// 시안의 테두리 상자 목록(세션·참여자). 행은 OptionRow.
export function OptionList({
  labelledBy,
  value,
  disabled,
  onValueChange,
  children,
}: OptionListProps) {
  return (
    <RadioGroup
      value={value}
      disabled={disabled}
      onValueChange={(next) => onValueChange(next as string)}
      aria-labelledby={labelledBy}
      render={
        <VStack className="divide-y divide-(--rc-color-border-subtle) overflow-hidden rounded-400 border border-gray-200 bg-surface" />
      }
    >
      {children}
    </RadioGroup>
  );
}
