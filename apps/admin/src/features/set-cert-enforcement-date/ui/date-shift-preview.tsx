import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ArrowRight } from "lucide-react";

import { Tag } from "@/shared/ui";

import { formatEnforcementDate } from "../model/format-enforcement-date";
import { shiftLabel } from "../model/shift-label";

interface DateShiftPreviewProps {
  from: Date;
  to: Date;
}

export function DateShiftPreview({ from, to }: DateShiftPreviewProps) {
  const shift = shiftLabel({ from, to });
  return (
    <HStack
      align="center"
      gap="150"
      className="mt-125 rounded-400 border border-gray-200 bg-gray-50 px-150 py-125"
    >
      <VStack>
        <Text typography="body5" foreground="hint">
          현재
        </Text>
        <Text typography="body3" foreground="muted">
          {formatEnforcementDate(from).label}
        </Text>
      </VStack>
      <ArrowRight size={16} aria-hidden className="text-(--rc-color-fg-hint)" />
      <VStack>
        <Text typography="body5" foreground="hint">
          변경 후
        </Text>
        <Text typography="body3" weight="bold">
          {formatEnforcementDate(to).label}
        </Text>
      </VStack>
      {shift ? (
        <div className="ml-auto">
          <Tag tone="warning">{shift}</Tag>
        </div>
      ) : null}
    </HStack>
  );
}
