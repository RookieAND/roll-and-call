"use client";

import { Card, Chip, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { Plus, X } from "lucide-react";

import type { DayIntervalRow } from "../model/day-interval-row";
import { ConflictNote } from "./conflict-note";
import { IntervalFields } from "./interval-fields";

interface AvailabilityDayEditorProps {
  label: string;
  rows: DayIntervalRow[];
  conflicts: Map<number, string>;
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onHourChange: (index: number, edge: "from" | "to", hour: number) => void;
}

export function AvailabilityDayEditor({
  label,
  rows,
  conflicts,
  onToggle,
  onAdd,
  onRemove,
  onHourChange,
}: AvailabilityDayEditorProps) {
  const on = rows.length > 0;
  return (
    <VStack gap="075">
      <HStack align="center" gap="075">
        <Chip
          selected={on}
          aria-label={`${label}요일 ${on ? "끄기" : "켜기"}`}
          aria-pressed={on}
          className="h-11 w-11 flex-none rounded-400 p-0"
          onClick={onToggle}
        >
          {label}
        </Chip>
        {on ? (
          <IntervalFields
            label={label}
            row={rows[0]!}
            invalid={conflicts.has(rows[0]!.index)}
            onHourChange={onHourChange}
            trailing={
              <IconButton
                variant="ghost"
                aria-label={`${label}요일 구간 추가`}
                className="h-11 w-11 flex-none"
                onClick={onAdd}
              >
                <Plus size={16} aria-hidden />
              </IconButton>
            }
          />
        ) : (
          <Card.Root
            padding="none"
            radius={400}
            className="flex h-11 min-w-0 flex-1 items-center justify-center border-dashed border-gray-300 text-hint"
          >
            <Text typography="body4" foreground="inherit">
              안 되는 날
            </Text>
          </Card.Root>
        )}
      </HStack>
      {on && <ConflictNote message={conflicts.get(rows[0]!.index)} />}

      {rows.slice(1).map((row) => (
        <VStack key={row.index} gap="075">
          <HStack align="center" gap="075">
            <span className="h-11 w-11 flex-none" />
            <IntervalFields
              label={label}
              row={row}
              invalid={conflicts.has(row.index)}
              onHourChange={onHourChange}
              trailing={
                <IconButton
                  variant="ghost"
                  aria-label={`${label}요일 구간 지우기`}
                  className="h-11 w-11 flex-none"
                  onClick={() => onRemove(row.index)}
                >
                  <X size={15} aria-hidden />
                </IconButton>
              }
            />
          </HStack>
          <ConflictNote message={conflicts.get(row.index)} />
        </VStack>
      ))}
    </VStack>
  );
}
