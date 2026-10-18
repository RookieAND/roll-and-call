"use client";

import { Button, IconButton, Popover, VStack, cn } from "@roll-and-call/ui";
import { Ellipsis, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { ServerLink } from "./server-link";

export interface MoreMenuItem {
  label: string;
  icon?: LucideIcon;
  // 서버 화면 안 경로. 외부 주소는 externalHref, 둘 다 없으면 onSelect를 부른다.
  href?: string;
  externalHref?: string;
  scroll?: boolean;
  danger?: boolean;
  onSelect?: () => void;
}

interface MoreMenuProps {
  label: string;
  items: MoreMenuItem[];
  widthClassName?: string;
  disabled?: boolean;
}

export function MoreMenu({
  label,
  items,
  widthClassName = "w-[200px]",
  disabled = false,
}: MoreMenuProps) {
  const [open, setOpen] = useState(false);
  const renderLink = ({ href, externalHref, scroll }: MoreMenuItem) => {
    if (externalHref) return <a href={externalHref} target="_blank" rel="noreferrer" />;
    if (href) return <ServerLink path={href} scroll={scroll} />;
    return undefined;
  };
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={disabled}
        render={<IconButton variant="outline" size="sm" aria-label={label} />}
      >
        <Ellipsis size={16} aria-hidden />
      </Popover.Trigger>
      <Popover.Popup align="end" className={cn(widthClassName, "p-075")}>
        <VStack>
          {items.map((item) => {
            const { label: itemLabel, icon: Icon, danger, onSelect } = item;
            return (
              <Button
                key={itemLabel}
                variant="ghost"
                colorPalette={danger ? "danger" : "gray"}
                size="sm"
                render={renderLink(item)}
                onClick={() => {
                  setOpen(false);
                  onSelect?.();
                }}
                className="justify-start gap-100"
              >
                {Icon ? <Icon size={16} aria-hidden /> : null}
                {itemLabel}
              </Button>
            );
          })}
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
