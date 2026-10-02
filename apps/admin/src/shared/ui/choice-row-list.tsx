import { HStack, SegmentedControl, Text, VStack, cn } from "@roll-and-call/ui";

export interface ChoiceRow {
  id: string;
  title: string;
  meta: string;
  // 첫 값이 기본(그대로 두기)이고, 나머지를 고르면 행이 위험 색으로 바뀐다.
  options: readonly [{ value: string; label: string }, { value: string; label: string }];
  value: string;
}

interface ChoiceRowListProps {
  rows: ChoiceRow[];
  onChange: (id: string, value: string) => void;
}

// 시안 EntityList + EntityRow + 오른쪽 sm 세그먼트(예: 참여 진행 / 참여 취소).
export function ChoiceRowList({ rows, onChange }: ChoiceRowListProps) {
  return (
    <VStack className="divide-y divide-(--rc-color-border-subtle) overflow-hidden rounded-400 border border-gray-200 bg-surface">
      {rows.map((row) => {
        const [keep, change] = row.options;
        return (
          <HStack
            key={row.id}
            align="center"
            gap="125"
            className={cn("px-150 py-125", row.value !== keep.value && "bg-danger-50")}
          >
            <VStack gap="025" className="min-w-0 flex-1">
              <Text typography="subtitle2" truncate>
                {row.title}
              </Text>
              <Text typography="body4" foreground="hint" truncate>
                {row.meta}
              </Text>
            </VStack>
            <SegmentedControl.Root
              value={row.value}
              onValueChange={(value) => onChange(row.id, value as string)}
              aria-label={`${row.title} 처리`}
              size="sm"
              fullWidth={false}
              className="shrink-0"
            >
              <SegmentedControl.Item value={keep.value}>{keep.label}</SegmentedControl.Item>
              <SegmentedControl.Item value={change.value} colorPalette="danger">
                {change.label}
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          </HStack>
        );
      })}
    </VStack>
  );
}
