import { Callout, type CalloutPalette } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ActionNoticeProps {
  title?: ReactNode;
  colorPalette?: CalloutPalette;
  children: ReactNode;
}

// 액션 바의 상태 카드. Callout sm으로 대체한다.
export function ActionNotice({ title, colorPalette = "gray", children }: ActionNoticeProps) {
  return (
    <Callout.Root colorPalette={colorPalette} size="sm">
      <Callout.Icon />
      <div>
        {title && <Callout.Title>{title}</Callout.Title>}
        <Callout.Description>{children}</Callout.Description>
      </div>
    </Callout.Root>
  );
}
