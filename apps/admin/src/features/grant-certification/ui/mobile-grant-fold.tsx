"use client";

import { Collapsible, Text } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface MobileGrantFoldProps {
  title: string;
  summary: string;
  children: ReactNode;
}

// 부가 정보는 접힌 한 줄로 두고 눌러 펼친다.
export function MobileGrantFold({ title, summary, children }: MobileGrantFoldProps) {
  return (
    <Collapsible.Root className="rounded-600 border border-gray-200 bg-surface">
      <Collapsible.Trigger className="flex min-h-12 w-full items-center gap-100 px-150 text-left">
        <Text typography="body3" weight="bold">
          {title}
        </Text>
        <Text typography="body4" foreground="muted" truncate className="min-w-0 flex-1 text-right">
          {summary}
        </Text>
        <ChevronDown size={16} aria-hidden className="shrink-0 text-hint" />
      </Collapsible.Trigger>
      <Collapsible.Panel className="border-t border-(--rc-color-border-subtle) px-150 pb-150">
        {children}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
