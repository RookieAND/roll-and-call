import { HStack, Text, VStack } from "@roll-and-call/ui";

interface CellDetailProps {
  label: string;
  finishedCount: number;
  openCount: number;
}

export function CellDetail({ label, finishedCount, openCount }: CellDetailProps) {
  const values = [
    { label: "진행된 세션", count: finishedCount },
    { label: "모집 중", count: openCount },
  ];
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
      {values.map((value) => (
        <VStack
          key={value.label}
          className="flex-1 border-r border-(--rc-color-border-subtle) px-175 py-125 last:border-r-0"
        >
          <Text typography="body4" foreground="hint">
            {value.label}
          </Text>
          <Text typography="body2" weight="extrabold" numeric>
            {value.count}건
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}
