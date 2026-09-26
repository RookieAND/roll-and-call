"use client";

import { Button, HStack, Sheet, Text, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

import { RulebookOption, type EditionSet, type MyRulebooks } from "@/entities/rulebook";

import { ruleReason } from "../model/rule-reason";
import { ruleSheetGroups } from "../model/rule-sheet-groups";
import { RulebookSheetGroup } from "./rulebook-sheet-group";

interface GameRulebookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulebooks: MyRulebooks;
  selectedKey: string | null;
  onSelect: (set: EditionSet) => void;
}

// 룰은 카테고리·판본 단위로 고른다. 인증이 필요한 룰도 고를 수 있고, 열 수 있는지는 룰 칸 아래에서 알려 준다.
export function GameRulebookSheet({
  open,
  onOpenChange,
  rulebooks,
  selectedKey,
  onSelect,
}: GameRulebookSheetProps) {
  const [query, setQuery] = useState("");
  const groups = ruleSheetGroups(rulebooks, query);

  const pick = (set: EditionSet) => {
    onSelect(set);
    onOpenChange(false);
  };

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰 선택" className="max-h-[94dvh] px-0">
        <Sheet.Handle />
        <HStack align="center" className="min-h-12 pr-050 pl-200">
          <Text typography="heading3" render={<h2 />} className="flex-1">
            룰 선택
          </Text>
          <Sheet.Close render={<Button variant="ghost" />}>닫기</Sheet.Close>
        </HStack>
        <div className="px-200 pt-050 pb-100">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="룰 이름으로 찾기 (예: CoC, 더크)"
            aria-label="룰 이름으로 찾기"
          />
        </div>
        <Sheet.Body className="px-200 pb-200" role="radiogroup" aria-label="룰">
          {groups.mine.length > 0 && (
            <RulebookSheetGroup title="내가 인증한 룰" count={groups.mine.length}>
              {groups.mine.map(({ set }) => (
                <RulebookOption
                  key={set.key}
                  name={set.categoryName}
                  edition={set.edition}
                  selected={set.key === selectedKey}
                  onClick={() => pick(set)}
                />
              ))}
            </RulebookSheetGroup>
          )}
          {groups.free.length > 0 && (
            <RulebookSheetGroup title="인증 없이 열 수 있는 룰" count={groups.free.length}>
              {groups.free.map(({ set }) => (
                <RulebookOption
                  key={set.key}
                  name={set.categoryName}
                  edition={set.edition}
                  free
                  selected={set.key === selectedKey}
                  onClick={() => pick(set)}
                />
              ))}
            </RulebookSheetGroup>
          )}
          {groups.needed.length > 0 && (
            <RulebookSheetGroup title="인증이 필요한 룰">
              {groups.needed.map(({ set, gate }) => (
                <RulebookOption
                  key={set.key}
                  name={set.categoryName}
                  edition={set.edition}
                  selected={set.key === selectedKey}
                  reason={
                    <Text typography="body4" weight="bold" foreground="hint" className="flex-none">
                      {ruleReason(set, gate)}
                    </Text>
                  }
                  onClick={() => pick(set)}
                />
              ))}
            </RulebookSheetGroup>
          )}
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
