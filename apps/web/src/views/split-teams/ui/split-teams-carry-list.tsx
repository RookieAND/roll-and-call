import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";

const GAME_ROW = { title: "게임 정보", description: "룰 · 시놉시스 · 플레이타임" } as const;
const NOTE_ROW = {
  title: "신청글",
  description: "선택한 참여자의 신청글이 함께 보입니다",
} as const;

interface SplitTeamsCarryListProps {
  carriesApplicationNote: boolean;
}

// 가능 시간은 넘기지 않으므로 그 줄은 두지 않는다.
export function SplitTeamsCarryList({ carriesApplicationNote }: SplitTeamsCarryListProps) {
  const rows = carriesApplicationNote ? [GAME_ROW, NOTE_ROW] : [GAME_ROW];

  return (
    <VStack gap="100">
      <Text typography="body4" weight="bold" foreground="muted">
        그대로 넘어가는 것
      </Text>
      {rows.map((row) => (
        <Card.Root key={row.title} padding="none" radius={500}>
          <HStack align="start" gap="125" className="px-175 py-150">
            <Check size={16} aria-hidden className="mt-025 shrink-0 text-success-700" />
            <VStack gap={0} className="min-w-0">
              <Text typography="subtitle2">{row.title}</Text>
              <Text typography="body4" foreground="hint">
                {row.description}
              </Text>
            </VStack>
          </HStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
