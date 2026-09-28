import { Card, cn } from "@roll-and-call/ui";
import type { MouseEventHandler } from "react";

interface PhotoThumbProps {
  url: string;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
}

// ponytail: Card에 '고른 상태'가 없어 2px 테두리만 덧댄다. DS에 selected가 생기면 바꾼다.
export function PhotoThumb({ url, label, onClick, selected = false }: PhotoThumbProps) {
  const interactive = Boolean(onClick);
  return (
    <Card.Root
      radius={400}
      padding="none"
      interactive={interactive}
      render={interactive ? <button type="button" onClick={onClick} /> : undefined}
      role={interactive ? undefined : "img"}
      aria-label={label}
      aria-current={selected || undefined}
      className={cn(
        "h-[66px] w-[88px] shrink-0 overflow-hidden",
        interactive && "cursor-zoom-in",
        selected && "border-2 border-gray-900",
      )}
    >
      <img src={url} alt="" className="size-full object-cover" />
    </Card.Root>
  );
}
