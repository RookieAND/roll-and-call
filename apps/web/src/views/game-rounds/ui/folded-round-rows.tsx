"use client";

import { Collapsible, HStack, Text } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import type { RoundRowView } from "../model/round-row";
import { RoundRow } from "./round-row";

interface FoldedRoundRowsProps {
  gameId: string;
  views: RoundRowView[];
}

export function FoldedRoundRows({ gameId, views }: FoldedRoundRowsProps) {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger className="group block w-full cursor-pointer px-150 py-125 text-left">
        <HStack align="center" gap="075">
          <Text typography="body3" foreground="muted" className="flex-1">
            지난 회차 {views.length}개
          </Text>
          <ChevronDown
            size={18}
            aria-hidden
            className="text-hint transition-transform group-data-panel-open:rotate-180"
          />
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Panel className="[&>*]:border-t [&>*]:border-gray-200">
        {views.map((view) => (
          <RoundRow key={view.key} gameId={gameId} view={view} />
        ))}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
