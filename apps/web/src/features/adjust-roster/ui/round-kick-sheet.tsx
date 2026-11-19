"use client";

import { Button, HStack, SegmentedControl, Sheet, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState } from "react";

import {
  ConfirmDialog,
  LineBreaks,
  SheetCloseIcon,
  toast,
  toastActionError,
  useAction,
} from "@/shared/ui";

import { removeParticipant } from "../api/remove-participant";
import type { MemberSummary } from "../model/member-summary";
import { ROUND_KICK_OPTIONS, type RoundKickWay } from "../model/round-kick-way";

interface RoundKickSheetProps {
  gameId: string;
  member: MemberSummary | null;
  onClose: () => void;
}

// 다회차 1회차 시작 뒤 확정자 내보내기. 방식을 고른 뒤 확인 창으로 한 번 더 묻는다.
export function RoundKickSheet({ gameId, member, onClose }: RoundKickSheetProps) {
  const [way, setWay] = useState<RoundKickWay | null>(null);
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const option = ROUND_KICK_OPTIONS.find((candidate) => candidate.value === way);
  const title = `${member?.username ?? ""}님을 내보내시겠습니까`;

  function close() {
    setWay(null);
    setConfirming(false);
    onClose();
  }

  function remove() {
    if (!member || isNull(way)) return;
    run(() => removeParticipant({ gameId, userId: member.userId, leftReason: way }), {
      onSuccess: () => {
        toast.success(`${member.username}님을 내보냈습니다.`);
        close();
      },
      onError: (result) => {
        setConfirming(false);
        toastActionError(result);
      },
    });
  }

  return (
    <Sheet.Root open={!isNull(member)} onOpenChange={(open) => !open && close()}>
      <Sheet.Popup>
        <Sheet.Handle />
        <VStack gap="200">
          <HStack align="center">
            <Sheet.Title className="mb-0 flex-1">{title}</Sheet.Title>
            <SheetCloseIcon />
          </HStack>
          <SegmentedControl.Root
            aria-label="내보내는 방식"
            value={way ?? ""}
            onValueChange={(next) => setWay(next as RoundKickWay)}
          >
            {ROUND_KICK_OPTIONS.map((candidate) => (
              <SegmentedControl.Item key={candidate.value} value={candidate.value}>
                {candidate.label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
          <VStack gap="075">
            {option && (
              <Text typography="body3" foreground="muted" render={<p />}>
                <LineBreaks lines={option.lines} />
              </Text>
            )}
            <Text typography="body4" foreground="hint" render={<p />}>
              출석한 회차는 순위에 그대로 반영됩니다.
            </Text>
          </VStack>
          <HStack gap="100">
            <Sheet.Close render={<Button variant="outline" size="lg" className="flex-1" />}>
              취소
            </Sheet.Close>
            <Button
              variant="solid"
              colorPalette="danger"
              size="lg"
              className="flex-1"
              disabled={isNull(way)}
              onClick={() => setConfirming(true)}
            >
              내보내기
            </Button>
          </HStack>
        </VStack>
      </Sheet.Popup>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={title}
        description={
          option && <LineBreaks lines={[...option.lines, "이 작업은 되돌릴 수 없습니다."]} />
        }
        confirmLabel="내보내기"
        confirmColorPalette="danger"
        pending={pending}
        onConfirm={remove}
      />
    </Sheet.Root>
  );
}
