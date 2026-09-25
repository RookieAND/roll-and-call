import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { RULEBOOK_KIND_LABEL, type MyRulebook } from "@/entities/rulebook";

interface RulebookFieldProps {
  rulebooks: MyRulebook[];
  onOpen: () => void;
}

// 고른 책들. 카테고리·판본을 위에 한 번, 아래에 책마다 한 줄.
export function RulebookField({ rulebooks, onOpen }: RulebookFieldProps) {
  const [first] = rulebooks;
  return (
    // ponytail: 여러 줄 값을 담는 선택 칸이라 Select 대신 시트를 여는 칸을 손으로 둔다.
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-14 w-full items-center gap-125 rounded-500 border border-gray-300 px-175 py-125 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      {first ? (
        <VStack gap="075" className="min-w-0 flex-1">
          <Text typography="body4" weight="bold" foreground="muted">
            {`${first.categoryName} ${first.edition}`.trim()}
          </Text>
          {rulebooks.map((rulebook) => (
            <HStack key={rulebook.id} align="center" gap="075">
              <Text typography="body2" weight="bold">
                {rulebook.shortName}
              </Text>
              <Badge>{RULEBOOK_KIND_LABEL[rulebook.kind]}</Badge>
            </HStack>
          ))}
        </VStack>
      ) : (
        <Text typography="body2" foreground="hint" className="flex-1">
          인증받을 룰북을 골라 주세요
        </Text>
      )}
      <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
    </button>
  );
}
