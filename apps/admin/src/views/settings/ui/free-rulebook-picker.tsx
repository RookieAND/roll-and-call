"use client";

import { Button, Popover, TextInput, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import type { RulebookOption } from "@/shared/server";

interface FreeRulebookPickerProps {
  candidates: RulebookOption[];
  onPick: (id: string) => void;
}

const MAX_RESULTS = 8;

export function FreeRulebookPicker({ candidates, onPick }: FreeRulebookPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const keyword = query.trim();
  const matches = candidates
    .filter((rulebook) => !keyword || rulebook.label.includes(keyword))
    .slice(0, MAX_RESULTS);

  const pick = (id: string) => {
    onPick(id);
    setQuery("");
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        render={<Button variant="outline" colorPalette="gray" size="sm" className="gap-050" />}
      >
        <Plus size={14} aria-hidden />룰 추가
      </Popover.Trigger>
      <Popover.Popup align="end" className="w-[320px] p-100">
        <VStack gap="075">
          <TextInput
            type="search"
            aria-label="룰북 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <VStack>
            {matches.map((rulebook) => (
              <Button
                key={rulebook.id}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                onClick={() => pick(rulebook.id)}
                className="justify-start"
              >
                {rulebook.label}
              </Button>
            ))}
          </VStack>
        </VStack>
      </Popover.Popup>
    </Popover.Root>
  );
}
