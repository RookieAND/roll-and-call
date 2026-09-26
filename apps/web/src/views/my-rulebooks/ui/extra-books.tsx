"use client";

import { Card, Collapsible, HStack, Text } from "@roll-and-call/ui";
import { BookOpen, ChevronDown } from "lucide-react";

import type { ListRow } from "../model/list-row";
import { ListRowItem } from "./list-row-item";

interface ExtraBooksProps {
  rows: ListRow[];
}

// 서플리먼트·플레이어 책은 GM 자격과 무관해 접어 두고, 반려가 있으면 펼쳐 둔다.
export function ExtraBooks({ rows }: ExtraBooksProps) {
  const needsAttention = rows.some((row) => row.tone === "warning");
  return (
    <Collapsible.Root defaultOpen={needsAttention}>
      <Collapsible.Trigger className="group flex min-h-11 w-full items-center gap-100 px-050 text-left">
        <BookOpen size={16} strokeWidth={2.1} aria-hidden className="flex-none text-gray-600" />
        <HStack className="min-w-0 flex-1">
          <Text typography="body3" weight="medium" foreground="muted">
            서플리먼트 · 플레이어 책 {rows.length}권
          </Text>
        </HStack>
        <ChevronDown
          size={16}
          aria-hidden
          className="flex-none text-hint transition-transform group-data-[panel-open]:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <Card.Root padding="none" className="mt-075 overflow-hidden">
          {rows.map((row) => (
            <ListRowItem key={row.key} row={row} />
          ))}
        </Card.Root>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
