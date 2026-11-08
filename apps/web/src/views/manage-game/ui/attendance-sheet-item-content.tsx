import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

interface AttendanceSheetItemContentProps {
  title: string;
  description: string;
}

export function AttendanceSheetItemContent({
  title,
  description,
}: AttendanceSheetItemContentProps) {
  return (
    <HStack align="center" gap="150" render={<span />} className="w-full">
      <VStack gap="025" render={<span />} className="min-w-0 flex-1 items-start text-left">
        <Text typography="subtitle1">{title}</Text>
        <Text typography="body4" foreground="muted">
          {description}
        </Text>
      </VStack>
      <ChevronRight size={16} className="flex-none text-hint" aria-hidden />
    </HStack>
  );
}
