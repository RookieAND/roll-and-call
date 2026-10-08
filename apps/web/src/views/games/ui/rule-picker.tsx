"use client";

import { Button, Checkbox, HStack, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { xor } from "es-toolkit";
import { Check, Search } from "lucide-react";
import { useState } from "react";

import type { RuleOption } from "../model/rule-option";

interface RulePickerProps {
  options: RuleOption[];
  selected: string[];
  onDone: (keys: string[]) => void;
}

export function RulePicker({ options, selected, onDone }: RulePickerProps) {
  const [keys, setKeys] = useState(selected);
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const visible = keyword
    ? options.filter((option) => option.label.toLowerCase().includes(keyword))
    : options;
  const caption = keyword ? `검색 결과 ${visible.length}개` : "지금 진행 중인 구인이 있는 룰";

  return (
    <>
      <Sheet.Title className="mb-100">룰 고르기</Sheet.Title>
      <Sheet.Body>
        <VStack gap="150" className="h-[min(60dvh,28rem)]">
          <div className="relative">
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-150 z-10 -translate-y-1/2 text-hint"
            />
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="룰 이름 검색"
              aria-label="룰 검색"
              className="pl-9"
            />
          </div>
          <Text typography="body4" foreground="hint">
            {caption}
          </Text>
          <ul className="min-h-0 flex-1 divide-y divide-gray-200 overflow-y-auto border-t border-gray-200">
            {visible.map((option) => (
              <li key={option.key}>
                <label className="flex min-h-[52px] cursor-pointer items-center gap-150">
                  <Checkbox.Root
                    checked={keys.includes(option.key)}
                    onCheckedChange={() => setKeys(xor(keys, [option.key]))}
                    aria-label={option.label}
                  >
                    <Checkbox.Indicator>
                      <Check size={14} strokeWidth={3} aria-hidden />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="min-w-0 flex-1 text-subtitle1 font-semibold">
                    {option.label}
                  </span>
                  <span className="flex-none text-body4 text-hint tabular-nums">
                    {option.count}건
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </VStack>
      </Sheet.Body>
      <Sheet.Footer>
        <HStack>
          <Button size="lg" className="flex-1" onClick={() => onDone(keys)}>
            {keyword && keys.length > 0 ? `${keys.length}개 선택` : "선택 완료"}
          </Button>
        </HStack>
      </Sheet.Footer>
    </>
  );
}
