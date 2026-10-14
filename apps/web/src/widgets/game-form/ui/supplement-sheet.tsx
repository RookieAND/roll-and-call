"use client";

import { SUPPLEMENT_SEARCH_THRESHOLD } from "@roll-and-call/database/games/model";
import { Button, Grid, Sheet, Text, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

import type { SupplementOption } from "@/entities/rulebook";

import { filterSupplementOptions } from "../model/filter-supplement-options";
import { supplementApplyLabel } from "../model/supplement-apply-label";
import { SupplementOptionRow } from "./supplement-option-row";

interface SupplementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleLabel: string;
  options: SupplementOption[];
  pickedIds: string[];
  room: number;
  onApply: (ids: string[]) => void;
}

// 열 때마다 key를 바꿔 새로 그리므로 고른 값은 처음 넘긴 pickedIds에서 시작한다.
export function SupplementSheet({
  open,
  onOpenChange,
  ruleLabel,
  options,
  pickedIds,
  room,
  onApply,
}: SupplementSheetProps) {
  const [draft, setDraft] = useState<string[]>(pickedIds);
  const [query, setQuery] = useState("");
  const searchable = options.length > SUPPLEMENT_SEARCH_THRESHOLD;
  const visible = filterSupplementOptions({ options, query });
  const full = draft.length >= room;
  const applyLabel = supplementApplyLabel({
    draftCount: draft.length,
    pickedCount: pickedIds.length,
  });
  const applyDisabled = draft.length === 0 && pickedIds.length === 0;

  const toggle = (id: string, checked: boolean) =>
    setDraft((current) => (checked ? [...current, id] : current.filter((value) => value !== id)));
  const apply = () => {
    onApply(options.filter((option) => draft.includes(option.id)).map((option) => option.id));
    onOpenChange(false);
  };

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Popup aria-label="서플리먼트 선택" className="max-h-[94dvh]">
        <Sheet.Handle />
        <Sheet.Title>서플리먼트 선택</Sheet.Title>
        <Text typography="body3" foreground="muted" render={<p />} className="pt-050 pb-100">
          {ruleLabel}에 등록된 서플리먼트입니다.
        </Text>
        {searchable && (
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름으로 찾기"
            aria-label="서플리먼트 이름으로 찾기"
            className="mb-100"
          />
        )}
        <Sheet.Body className="[&>*+*]:border-t [&>*+*]:border-gray-200">
          {visible.map((option) => (
            <SupplementOptionRow
              key={option.id}
              option={option}
              checked={draft.includes(option.id)}
              full={full}
              onToggle={(checked) => toggle(option.id, checked)}
            />
          ))}
          {visible.length === 0 && (
            <Text
              typography="body3"
              foreground="hint"
              render={<p />}
              className="py-300 text-center"
            >
              찾는 서플리먼트가 없습니다.
            </Text>
          )}
        </Sheet.Body>
        <Sheet.Footer>
          <Grid cols={2} gap="100">
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="button" size="lg" disabled={applyDisabled} onClick={apply}>
              {applyLabel}
            </Button>
          </Grid>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
