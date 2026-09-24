import { HStack, SegmentedControl, Text, VStack, cn } from "@roll-and-call/ui";

type OngoingAction = "keep" | "leave" | "close";

export interface OngoingChoiceRow {
  id: string;
  title: string;
  meta: string;
  alternativeLabel: string;
  action: OngoingAction;
  alternativeAction: Exclude<OngoingAction, "keep">;
}

interface OngoingChoiceListProps {
  rows: OngoingChoiceRow[];
  onChange?: (id: string, action: OngoingAction) => void;
  readOnly?: boolean;
}

export function OngoingChoiceList({ rows, onChange, readOnly = false }: OngoingChoiceListProps) {
  return (
    <VStack className="divide-y divide-(--rc-color-border-subtle) overflow-hidden rounded-400 border border-gray-200 bg-surface">
      {rows.map((row) => (
        <HStack
          key={row.id}
          align="center"
          gap="125"
          className={cn("px-150 py-125", row.action !== "keep" && "bg-danger-50")}
        >
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="body3" weight="medium" truncate>
              {row.title}
            </Text>
            <Text typography="body4" foreground="hint" truncate>
              {row.meta}
            </Text>
          </VStack>
          <SegmentedControl.Root
            value={row.action}
            onValueChange={(value) => onChange?.(row.id, value as OngoingAction)}
            aria-label={`${row.title} 처리`}
            size="sm"
            fullWidth={false}
            disabled={readOnly}
            className="shrink-0"
          >
            <SegmentedControl.Item value="keep">그대로 진행</SegmentedControl.Item>
            <SegmentedControl.Item value={row.alternativeAction} colorPalette="danger">
              {row.alternativeLabel}
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </HStack>
      ))}
    </VStack>
  );
}
