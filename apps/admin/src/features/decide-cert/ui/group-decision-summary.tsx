import { Badge, HStack, Text } from "@roll-and-call/ui";

interface GroupDecisionSummaryProps {
  approveCount: number;
  rejectCount: number;
}

export function GroupDecisionSummary({ approveCount, rejectCount }: GroupDecisionSummaryProps) {
  const approvePalette = approveCount > 0 ? "success" : "gray";
  const rejectPalette = rejectCount > 0 ? "danger" : "gray";
  return (
    <HStack
      align="center"
      gap="100"
      aria-live="polite"
      className="border-t border-(--rc-color-border-subtle) px-150 py-100"
    >
      <Text typography="body4" foreground="hint">
        처리 결과
      </Text>
      <Badge colorPalette={approvePalette}>{`승인 ${approveCount}권`}</Badge>
      <Badge colorPalette={rejectPalette}>{`반려 ${rejectCount}권`}</Badge>
    </HStack>
  );
}
