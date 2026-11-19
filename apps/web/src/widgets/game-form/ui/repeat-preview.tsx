"use client";

import { Card, Collapsible, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import { repeatResultLine } from "../model/multi-round-summary";
import { RepeatPreviewRow } from "./repeat-preview-row";

interface RepeatPreviewProps {
  form: UseFormReturn<GameFormValues>;
}

export function RepeatPreview({ form }: RepeatPreviewProps) {
  const { watch, setValue } = form;
  const values = watch();
  const rows = values.laterRounds ?? [];
  const resultLine = repeatResultLine(values);

  function changeRow(index: number, patch: { startAt?: string; endAt?: string }) {
    setValue(
      "laterRounds",
      rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch, edited: true } : row)),
      { shouldDirty: true },
    );
  }

  return (
    <VStack gap="100">
      {resultLine && (
        <Text typography="body4" foreground="muted" render={<p />}>
          {resultLine}
        </Text>
      )}
      <Card.Root padding="none" radius={500} className="overflow-hidden">
        <Collapsible.Root>
          <Collapsible.Trigger className="group block min-h-12 w-full cursor-pointer px-175 text-left">
            <HStack align="center" justify="between" gap="100">
              <Text typography="subtitle2">{values.roundCount}회 일정 미리 보기</Text>
              <ChevronDown
                size={16}
                aria-hidden
                className="flex-none text-hint transition-transform group-data-panel-open:rotate-180"
              />
            </HStack>
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <div className="border-t border-gray-100">
              {rows.map((row, index) => (
                <RepeatPreviewRow
                  key={index}
                  roundNo={index + 2}
                  row={row}
                  startError={form.formState.errors.laterRounds?.[index]?.startAt?.message}
                  endError={form.formState.errors.laterRounds?.[index]?.endAt?.message}
                  onChange={(patch) => changeRow(index, patch)}
                />
              ))}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      </Card.Root>
    </VStack>
  );
}
