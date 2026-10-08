import { Text, VStack, cn } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

interface RuleFieldProps {
  summary: string;
  active: boolean;
  onClick: () => void;
}

export function RuleField({ summary, active, onClick }: RuleFieldProps) {
  return (
    <VStack gap="100" render={<section />} aria-label="룰">
      <Text typography="subtitle2" render={<h3 />}>
        룰
      </Text>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-12 items-center gap-100 rounded-500 border border-gray-300 px-175 text-left focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
      >
        <span className={cn("min-w-0 flex-1 truncate text-subtitle1", !active && "text-hint")}>
          {summary}
        </span>
        <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
      </button>
    </VStack>
  );
}
