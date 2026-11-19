import { Avatar, Badge, Button, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import type { ScheduleConflictRejection } from "@/entities/game";
import { useServerPath } from "@/shared/lib";

import { conflictLines } from "../model/conflict-lines";

interface ScheduleConflictSectionProps {
  gameId: string;
  conflict: ScheduleConflictRejection;
  nicknames: Record<string, string>;
  showRoundNos: boolean;
}

// 시간이 겹치는 참여자를 Callout이 아니라 따로 선 경고 섹션으로 보인다.
export function ScheduleConflictSection({
  gameId,
  conflict,
  nicknames,
  showRoundNos,
}: ScheduleConflictSectionProps) {
  const toServerPath = useServerPath();
  const { lines, moreCount, hasWaiting } = conflictLines({ conflict, nicknames, showRoundNos });
  if (lines.length === 0) return null;
  const total = lines.length + moreCount;

  return (
    <Card.Root padding="md" radius={600} className="border-warning-600">
      <VStack gap="150">
        <HStack align="center" gap="075">
          <TriangleAlert size={18} aria-hidden className="flex-none text-warning-600" />
          <Text typography="subtitle2" render={<h3 />}>
            시간이 겹치는 참여자 {total}명
          </Text>
        </HStack>
        <VStack gap="100">
          {lines.map((line) => (
            <HStack key={line.text} align="center" gap="100">
              <Avatar name={line.name} size="sm" />
              <HStack align="center" gap="075" className="min-w-0 flex-1">
                {line.roundLabel && <Badge colorPalette="gray">{line.roundLabel}</Badge>}
                <Text typography="body3" weight="bold" truncate>
                  {line.name}님
                </Text>
                {line.waiting && <Badge colorPalette="gray">대기 중</Badge>}
              </HStack>
              <Text typography="body4" foreground="muted" className="flex-none">
                이 시간에 다른 세션이 있습니다
              </Text>
            </HStack>
          ))}
          {moreCount > 0 && (
            <Text typography="body4" foreground="hint">
              외 {moreCount}명
            </Text>
          )}
        </VStack>
        <Text typography="body4" foreground="muted">
          참여자에게 시간 조정을 요청하거나 다른 시간을 골라 주세요.
        </Text>
        {hasWaiting && (
          <Button
            size="sm"
            variant="outline"
            colorPalette="warning"
            className="self-start"
            render={<Link href={toServerPath(`/games/${gameId}/participants`)} />}
          >
            참여자 관리로 가기
          </Button>
        )}
      </VStack>
    </Card.Root>
  );
}
