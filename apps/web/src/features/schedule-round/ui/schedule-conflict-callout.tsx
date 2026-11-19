import { Button, Callout, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import type { ScheduleConflictRejection } from "@/entities/game";
import { useServerPath } from "@/shared/lib";

import { conflictLines } from "../model/conflict-lines";

interface ScheduleConflictCalloutProps {
  gameId: string;
  conflict: ScheduleConflictRejection;
  nicknames: Record<string, string>;
  showRoundNos: boolean;
}

export function ScheduleConflictCallout({
  gameId,
  conflict,
  nicknames,
  showRoundNos,
}: ScheduleConflictCalloutProps) {
  const toServerPath = useServerPath();
  const { lines, moreCount, hasWaiting } = conflictLines({ conflict, nicknames, showRoundNos });
  if (lines.length === 0) return null;

  return (
    <Callout.Root colorPalette="warning" size="sm">
      <Callout.Icon />
      <Callout.Description>
        <VStack gap="025">
          {lines.map((line) => (
            <span key={line.text}>
              {line.text}
              {line.waiting && " 대기 중"}
            </span>
          ))}
          {moreCount > 0 && <span>외 {moreCount}명</span>}
          <span>참여자에게 시간 조정을 요청하거나 다른 시간을 골라 주세요.</span>
        </VStack>
      </Callout.Description>
      {hasWaiting && (
        <Callout.Action>
          <Button
            size="sm"
            variant="outline"
            colorPalette="warning"
            render={<Link href={toServerPath(`/games/${gameId}/participants`)} />}
          >
            참여자 관리로 가기
          </Button>
        </Callout.Action>
      )}
    </Callout.Root>
  );
}
