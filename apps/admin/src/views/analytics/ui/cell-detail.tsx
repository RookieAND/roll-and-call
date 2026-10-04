import { HStack, Text, VStack } from "@roll-and-call/ui";

import { GRID_MODE, GRID_MODE_LABEL, type GridMode } from "../model/grid-mode";

interface CellDetailProps {
  label: string;
  mode: GridMode;
  counts: Record<GridMode, number>;
}

export function CellDetail({ label, mode, counts }: CellDetailProps) {
  const otherMode = mode === GRID_MODE.open ? GRID_MODE.finished : GRID_MODE.open;
  return (
    <HStack
      align="stretch"
      aria-live="polite"
      className="mt-150 overflow-hidden rounded-400 border border-gray-200"
    >
      <VStack className="border-r border-(--rc-color-border-subtle) bg-canvas px-175 py-125">
        <Text typography="body4" foreground="hint">
          선택한 칸
        </Text>
        <Text typography="body3" weight="bold" className="whitespace-nowrap">
          {label}
        </Text>
      </VStack>
      <VStack className="flex-1 px-175 py-125">
        <Text typography="body4" foreground="hint">
          {GRID_MODE_LABEL[mode]}
        </Text>
        <Text typography="body2" weight="bold" numeric>
          {counts[mode]}건
        </Text>
        <Text typography="body4" foreground="hint" numeric>
          {GRID_MODE_LABEL[otherMode]} {counts[otherMode]}건
        </Text>
      </VStack>
    </HStack>
  );
}
