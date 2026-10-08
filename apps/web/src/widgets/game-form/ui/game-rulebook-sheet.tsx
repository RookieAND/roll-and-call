"use client";

import { Button, HStack, Sheet, Text, TextInput } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";
import { useState } from "react";

import type { EditionSet, MyRulebooks } from "@/entities/rulebook";
import { RulebookRequestSheet } from "@/features/certify-rulebook";
import { useIsTrial } from "@/shared/trial";
import { EmptyState } from "@/shared/ui";

import { ruleSheetGroups } from "../model/rule-sheet-groups";
import { RulebookSheetGroup } from "./rulebook-sheet-group";
import { RulebookSheetOption } from "./rulebook-sheet-option";

interface GameRulebookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulebooks: MyRulebooks;
  selectedKey: string | null;
  onSelect: (set: EditionSet) => void;
}

export function GameRulebookSheet({
  open,
  onOpenChange,
  rulebooks,
  selectedKey,
  onSelect,
}: GameRulebookSheetProps) {
  const trial = useIsTrial();
  const [query, setQuery] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const groups = ruleSheetGroups({ data: rulebooks, query });

  const pick = (set: EditionSet) => {
    onSelect(set);
    onOpenChange(false);
  };
  const openRequest = () => {
    setRequestKey((key) => key + 1);
    setRequestOpen(true);
  };

  return (
    <>
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
              placeholder="룰 이름으로 찾기 (예: CoC, 더크)"
              aria-label="룰 이름으로 찾기"
            />
          </div>
          <Sheet.Body className="px-200 pb-200" role="radiogroup" aria-label="룰북">
            {groups.map((group) => (
              <RulebookSheetGroup key={group.name} title={group.name}>
                {group.options.map(({ set, gate }) => (
                  <RulebookSheetOption
                    key={set.key}
                    set={set}
                    gate={gate}
                    selected={set.key === selectedKey}
                    onPick={() => pick(set)}
                  />
                ))}
              </RulebookSheetGroup>
            ))}
            {groups.length === 0 && (
              <EmptyState
                image="empty-rulebook-search"
                size="section"
                title="맞는 룰이 없습니다"
                action={
                  trial ? undefined : (
                    <Button type="button" variant="outline" onClick={openRequest}>
                      룰북 추가 요청
                    </Button>
                  )
                }
                className="mt-150"
              />
            )}
          </Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
      {!trial && (
        <RulebookRequestSheet
          key={requestKey}
          open={requestOpen}
          onOpenChange={setRequestOpen}
          categoryNames={uniq(rulebooks.rulebooks.map((rulebook) => rulebook.categoryName))}
          pendingRequestNames={rulebooks.pendingRequestNames}
          initialName={query.trim()}
        />
      )}
    </>
  );
}
