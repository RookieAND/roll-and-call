"use client";

import { SUPPLEMENTS_MAX } from "@roll-and-call/database/games/model";
import { Button, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { foldSupplements } from "@/entities/game";
import { ruleSetOf, supplementOptions, type MyRulebooks } from "@/entities/rulebook";
import { manualSupplementError, type GameFormValues } from "@/features/write-game";
import { LineBreaks } from "@/shared/ui";

import { pickSupplements } from "../model/pick-supplements";
import { supplementHint } from "../model/supplement-hint";
import { SupplementManualInput } from "./supplement-manual-input";
import { SupplementRow } from "./supplement-row";
import { SupplementSheet } from "./supplement-sheet";

interface GameSupplementFieldProps {
  form: UseFormReturn<GameFormValues>;
  rulebooks?: MyRulebooks;
  editing: boolean;
}

export function GameSupplementField({ form, rulebooks, editing }: GameSupplementFieldProps) {
  const { watch, setValue, formState } = form;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const [inputOpen, setInputOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const items = watch("supplements");
  const rulebookId = watch("rulebookId");
  const set = rulebooks && rulebookId ? ruleSetOf({ myRulebooks: rulebooks, rulebookId }) : null;
  const options = set ? supplementOptions(set) : [];
  const hasOptions = options.length > 0;
  const ruleChosen = Boolean(rulebookId);
  const showListButton = hasOptions || !ruleChosen;
  const full = items.length >= SUPPLEMENTS_MAX;
  const { visible, foldable, hiddenCount } = foldSupplements({ items, expanded });
  const pickedIds = items.flatMap((item) =>
    options.some((option) => option.id === item.rulebookId) ? [item.rulebookId!] : [],
  );
  const room = SUPPLEMENTS_MAX - (items.length - pickedIds.length);
  const hint = ruleChosen
    ? supplementHint({ full, hasOptions, editing })
    : ["룰을 고르면 서플리먼트를 넣을 수 있습니다."];
  const fieldError = formState.errors.supplements?.message;

  const update = (next: GameFormValues["supplements"]) =>
    setValue("supplements", next, { shouldDirty: true, shouldValidate: true });
  const openSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  return (
    <VStack gap="100">
      <HStack align="baseline" gap="075">
        <Text typography="body4" weight="bold">
          서플리먼트
        </Text>
        <Text typography="body4" foreground="hint">
          선택
        </Text>
        <Text numeric typography="body4" foreground="hint" className="ml-auto">
          {items.length} / {SUPPLEMENTS_MAX}
        </Text>
      </HStack>

      {items.length > 0 && (
        <Card.Root padding="none" radius={500} className="overflow-hidden">
          <ul className="m-0 list-none p-0 [&>*+*]:border-t [&>*+*]:border-gray-200">
            {visible.map((item) => (
              <SupplementRow
                key={item.rulebookId ?? `manual:${item.name}`}
                item={item}
                onRemove={() => update(items.filter((candidate) => candidate !== item))}
              />
            ))}
          </ul>
          {foldable && (
            <Button
              type="button"
              variant="ghost"
              colorPalette="primary"
              aria-expanded={expanded}
              className="h-11 w-full rounded-none border-t border-gray-200"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "접기" : `${hiddenCount}권 더 보기`}
            </Button>
          )}
        </Card.Root>
      )}

      {inputOpen ? (
        <SupplementManualInput
          validate={(name) => manualSupplementError({ name, items, set })}
          onAdd={(name) => {
            update([...items, { name, rulebookId: null }]);
            setInputOpen(false);
          }}
          onCancel={() => setInputOpen(false)}
        />
      ) : (
        <Grid cols={showListButton ? 2 : 1} gap="100">
          {showListButton && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={!ruleChosen || (full && pickedIds.length === 0)}
              onClick={openSheet}
            >
              <List size={16} strokeWidth={2.4} aria-hidden />
              목록에서 고르기
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!ruleChosen || full}
            onClick={() => setInputOpen(true)}
          >
            <Plus size={16} strokeWidth={2.4} aria-hidden />
            직접 입력하기
          </Button>
        </Grid>
      )}

      {fieldError ? (
        <Text typography="body4" foreground="danger" role="alert">
          {fieldError}
        </Text>
      ) : (
        <Text typography="body4" foreground="hint" render={<p />} className="break-keep">
          <LineBreaks lines={hint} />
        </Text>
      )}

      {set && hasOptions && (
        <SupplementSheet
          key={sheetKey}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          ruleLabel={set.label}
          options={options}
          pickedIds={pickedIds}
          room={room}
          onApply={(ids) => update(pickSupplements({ items, options, ids }))}
        />
      )}
    </VStack>
  );
}
