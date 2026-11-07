import type { CSSProperties, ReactNode } from "react";

interface AccentScopeProps {
  accentColor: string | null | undefined;
  className?: string;
  children: ReactNode;
}

export function AccentScope({ accentColor, className, children }: AccentScopeProps) {
  const style = accentColor ? ({ "--acc": accentColor } as CSSProperties) : undefined;
  return (
    <div style={style} data-accent={accentColor ? "" : undefined} className={className}>
      {children}
    </div>
  );
}
