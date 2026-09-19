import { HStack, Text } from "@trpg/ui";
import type { ReactNode } from "react";

// 명단 시트 안의 한 묶음 — 제목 줄 + 행들. 묶음끼리 선으로 가르지 않는다.
export function RosterGroup({
  label,
  count,
  capacity,
  hint,
  children,
}: {
  label: string;
  count?: number;
  capacity?: number;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <HStack align="baseline" gap={2} className="mb-1">
        <Text typography="subtitle2" foreground="muted">
          {label}
        </Text>
        {count !== undefined && (
          <Text typography="body4" foreground="hint" className="tabular-nums">
            {count}명
          </Text>
        )}
        {capacity !== undefined && (
          <Text typography="body4" foreground="hint" className="tabular-nums">
            정원 {capacity}명
          </Text>
        )}
        {hint && (
          <Text typography="body4" foreground="hint">
            {hint}
          </Text>
        )}
      </HStack>
      <div className="divide-y divide-gray-200">{children}</div>
    </section>
  );
}
