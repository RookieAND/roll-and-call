import { cn } from "@roll-and-call/ui";
import type { CSSProperties, ReactNode } from "react";

interface AccentScopeProps {
  accentColor: string | null | undefined;
  className?: string;
  children: ReactNode;
}

// 프로필의 강조색을 --acc로 내려 보낸다. 아래 링크·성향 칩·편집 버튼·아바타 테두리가 이 값을 쓴다.
export function AccentScope({ accentColor, className, children }: AccentScopeProps) {
  const style = accentColor ? ({ "--acc": accentColor } as CSSProperties) : undefined;
  return (
    <div style={style} data-accent={accentColor ? "" : undefined} className={cn(className)}>
      {children}
    </div>
  );
}
