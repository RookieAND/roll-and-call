"use client";

import { Button, HStack, Sheet, Text, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

import { RulebookOption, type MyRulebook, type MyRulebooks } from "@/entities/rulebook";

import { rulebookSheetGroups } from "../model/rulebook-sheet-groups";
import { NeededRulebookOption } from "./needed-rulebook-option";
import { RulebookSheetGroup } from "./rulebook-sheet-group";

interface GameRulebookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulebooks: MyRulebooks;
  selectedId: string;
  onSelect: (rulebook: MyRulebook) => void;
}

export function GameRulebookSheet({
  open,
  onOpenChange,
  rulebooks,
  selectedId,
  onSelect,
}: GameRulebookSheetProps) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const groups = rulebookSheetGroups(rulebooks, query);

  const pick = (rulebook: MyRulebook) => {
    onSelect(rulebook);
    onOpenChange(false);
  };

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰북 선택" className="max-h-[94dvh] px-0">
        <Sheet.Handle />
        <HStack align="center" className="min-h-12 pr-050 pl-200">
          <Text typography="heading3" render={<h2 />} className="flex-1">
            룰북 선택
          </Text>
          <Sheet.Close render={<Button variant="ghost" />}>닫기</Sheet.Close>
        </HStack>
        <div className="px-200 pt-050 pb-100">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="룰북 이름으로 찾기 (예: CoC, 콜오크)"
            aria-label="룰북 이름으로 찾기"
          />
        </div>
        <Sheet.Body className="px-200 pb-200" role="radiogroup" aria-label="룰북">
          {groups.mine.length > 0 && (
            <RulebookSheetGroup title="내가 인증한 룰북" count={groups.mine.length}>
              {groups.mine.map(({ rulebook }) => (
                <RulebookOption
                  key={rulebook.id}
                  name={rulebook.name}
                  edition={rulebook.edition}
                  selected={rulebook.id === selectedId}
                  onClick={() => pick(rulebook)}
                />
              ))}
            </RulebookSheetGroup>
          )}
          {groups.free.length > 0 && (
            <RulebookSheetGroup title="인증 없이 열 수 있는 룰" count={groups.free.length}>
              {groups.free.map(({ rulebook }) => (
                <RulebookOption
                  key={rulebook.id}
                  name={rulebook.name}
                  edition={rulebook.edition}
                  free
                  selected={rulebook.id === selectedId}
                  onClick={() => pick(rulebook)}
                />
              ))}
            </RulebookSheetGroup>
          )}
          {groups.needed.length > 0 && (
            <RulebookSheetGroup title="인증이 필요한 룰북">
              {groups.needed.map(({ rulebook, pickable }) => (
                <NeededRulebookOption
                  key={rulebook.id}
                  rulebook={rulebook}
                  pickable={pickable}
                  enforcementDate={rulebooks.enforcementDate}
                  selected={rulebook.id === selectedId}
                  open={expandedId === rulebook.id}
                  onPick={() => pick(rulebook)}
                  onToggle={() =>
                    setExpandedId((current) => (current === rulebook.id ? null : rulebook.id))
                  }
                />
              ))}
            </RulebookSheetGroup>
          )}
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
