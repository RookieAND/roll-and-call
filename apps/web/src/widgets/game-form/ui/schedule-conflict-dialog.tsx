"use client";

import { AlertDialog, Button, Card, Text, VStack } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";

import { roundTimeRange, type ScheduleConflictRejection } from "@/entities/game";
import { formatDateWeekday } from "@/shared/lib";

interface ScheduleConflictDialogProps {
  rejection: ScheduleConflictRejection | null;
  // 여러 번 진행하는 구인이면 줄마다 「n회차 ·」를 붙인다.
  isMulti: boolean;
  onClose: () => void;
}

export function ScheduleConflictDialog({
  rejection,
  isMulti,
  onClose,
}: ScheduleConflictDialogProps) {
  const overlaps = rejection?.gmOverlaps ?? [];
  const roundNos = uniq(overlaps.map((overlap) => overlap.targetRoundNo)).toSorted((a, b) => a - b);
  const intro = isMulti
    ? `이 구인의 ${roundNos.map((roundNo) => `${roundNo}회차`).join(", ")}가 다른 세션과 겹칩니다.`
    : "이 구인의 일정이 다른 세션과 겹칩니다.";

  return (
    <AlertDialog.Root open={!!rejection} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Popup className="break-keep">
        <AlertDialog.Header>
          <AlertDialog.Title>구인을 등록할 수 없습니다</AlertDialog.Title>
          <AlertDialog.Description>{intro}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <VStack gap="150">
            <Card.Root radius={500} background="subtle" padding="md">
              <VStack gap="075">
                {overlaps.map((overlap) => (
                  <Text
                    key={`${overlap.targetRoundNo}-${overlap.gameTitle}`}
                    typography="body3"
                    render={<p />}
                  >
                    {isMulti ? `${overlap.targetRoundNo}회차 · ` : ""}
                    {formatDateWeekday(overlap.startsAt)}{" "}
                    {roundTimeRange({ startsAt: overlap.startsAt, endsAt: overlap.endsAt })} ↔{" "}
                    {overlap.gameTitle}
                  </Text>
                ))}
              </VStack>
            </Card.Root>
            <Text typography="body3" foreground="muted" render={<p />}>
              겹치는 세션을 확인한 뒤 다시 등록해 주세요.
            </Text>
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row">
          <Button size="lg" className="flex-1" onClick={onClose}>
            확인
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
