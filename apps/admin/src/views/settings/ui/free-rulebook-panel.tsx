"use client";

import { Chip, HStack, Text } from "@roll-and-call/ui";
import { X } from "lucide-react";

import type { RulebookOption } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { FreeRulebookPicker } from "./free-rulebook-picker";

interface FreeRulebookPanelProps {
  rulebooks: RulebookOption[];
  freeIds: string[];
  onChange: (freeIds: string[]) => void;
}

export function FreeRulebookPanel({ rulebooks, freeIds, onChange }: FreeRulebookPanelProps) {
  const free = rulebooks.filter((rulebook) => freeIds.includes(rulebook.id));
  const candidates = rulebooks.filter((rulebook) => !freeIds.includes(rulebook.id));
  return (
    <Panel
      title="무료 배포 룰"
      bodyClassName="p-175"
      right={
        <FreeRulebookPicker candidates={candidates} onPick={(id) => onChange([...freeIds, id])} />
      }
    >
      <Text typography="body4" foreground="muted" render={<p />} className="mb-100">
        이 서버에서 인증 없이 구인을 열 수 있는 룰입니다.
      </Text>
      <HStack gap="075" wrap>
        {free.map((rulebook) => (
          <Chip
            key={rulebook.id}
            selected
            aria-label={`${rulebook.label} 빼기`}
            onClick={() => onChange(freeIds.filter((id) => id !== rulebook.id))}
          >
            {rulebook.label}
            <X size={12} aria-hidden />
          </Chip>
        ))}
      </HStack>
    </Panel>
  );
}
