import { HStack, Text } from "@trpg/ui";
import type { ReactNode } from "react";

interface RosterGroupProps {
  label: string;
  count?: number;
  children: ReactNode;
}

// 명단 시트 안의 한 묶음 — 제목 줄 + 행들. 묶음끼리 선으로 가르지 않는다.
export function RosterGroup({ label, count, children }: RosterGroupProps) {
  return (
    <section>
      <HStack align="baseline" gap="100" className="mb-050">
        <Text typography="subtitle2" foreground="muted">
          {label}
        </Text>
        {count !== undefined && (
          <Text numeric typography="body4" foreground="hint">
            {count}명
          </Text>
        )}
      </HStack>
      <div className="divide-y divide-gray-200">{children}</div>
    </section>
  );
}
