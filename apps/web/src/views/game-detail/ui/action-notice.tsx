import { Callout, type CalloutPalette } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ActionNoticeProps {
  title?: ReactNode;
  colorPalette?: CalloutPalette;
  children: ReactNode;
}

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
