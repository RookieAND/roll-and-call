import { HStack, Text } from "@roll-and-call/ui";

interface CalendarSummaryRowProps {
  label: string;
  value: string;
}

export function CalendarSummaryRow({ label, value }: CalendarSummaryRowProps) {
  return (
    <HStack gap="150" align="center" className="min-h-10 px-175 py-100">
      <Text typography="body5" foreground="hint" className="w-[74px] shrink-0">
        {label}
      </Text>
      <Text typography="body4" weight="medium" numeric className="min-w-0">
        {value}
      </Text>
    </HStack>
  );
}
