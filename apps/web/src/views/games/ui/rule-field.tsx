import { Text, VStack } from "@roll-and-call/ui";
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
      {/* ponytail: 선택값을 보여주는 입력 칸 모양이라 Button 변형이 없어 직접 그린다. */}
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-12 items-center gap-100 rounded-500 border border-gray-300 px-175 text-left focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
      >
        <Text
          typography="subtitle1"
          weight="regular"
          foreground={active ? "inherit" : "hint"}
          truncate
          className="min-w-0 flex-1"
        >
          {summary}
        </Text>
        <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
      </button>
    </VStack>
  );
}
