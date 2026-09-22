import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface HomeRecordSectionProps {
  label: string;
  className?: string;
  children: ReactNode;
}

export function HomeRecordSection({ label, className, children }: HomeRecordSectionProps) {
  return (
    <div className={className}>
      <Text
        typography="body4"
        weight="extrabold"
        foreground="hint"
        render={<div />}
        className="mb-125 tracking-[0.06em]"
      >
        {label}
      </Text>
      {children}
    </div>
  );
}
