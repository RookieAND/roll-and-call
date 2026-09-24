import { Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { MyRulebook } from "@/entities/rulebook";

interface RulebookFieldProps {
  rulebook: MyRulebook | undefined;
  onOpen: () => void;
}

export function RulebookField({ rulebook, onOpen }: RulebookFieldProps) {
  return (
    // ponytail: 두 줄 값(이름·판본)을 담는 선택 칸이라 Select 대신 시트를 여는 칸을 손으로 둔다.
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-14 w-full items-center gap-125 rounded-500 border border-gray-300 px-175 py-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      {rulebook ? (
        <VStack className="min-w-0 flex-1">
          <Text typography="body2" weight="bold">
            {rulebook.name}
          </Text>
          <Text typography="body4" foreground="muted">
            {rulebook.edition || "기본판"}
          </Text>
        </VStack>
      ) : (
        <Text typography="body2" foreground="hint" className="flex-1">
          룰북과 판본을 선택해 주세요
        </Text>
      )}
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </button>
  );
}
