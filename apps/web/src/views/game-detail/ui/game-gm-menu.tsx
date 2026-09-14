"use client";

import { IconButton } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog, Sheet } from "@/shared/ui";
import { useDeleteGame } from "@/features/delete-game";
import { useEndSession } from "@/features/end-session";
import { useOpenSessionRooms } from "@/features/open-session-rooms";

// 4g: GM 본인 시점의 ⋯ 메뉴. 수정·삭제는 빈도가 낮고 파괴적이라
// 하단 액션 자리 대신 이 시트로 접는다. 삭제만 빨강 + 확인 다이얼로그.
// 디스코드 세션 채널은 열기 → 세션 종료(아카이브) 순서로 한 번씩만 노출된다.
export function GameGmMenu({
  gameId,
  roomsOpened,
  sessionEnded,
}: {
  gameId: string;
  roomsOpened: boolean;
  sessionEnded: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const { pending, remove } = useDeleteGame(gameId, () => {
    setConfirming(false);
    setOpen(false);
  });
  const { pending: opening, openRooms } = useOpenSessionRooms(gameId, () => setOpen(false));
  const { pending: ending, endSession } = useEndSession(gameId, () => {
    setConfirmingEnd(false);
    setOpen(false);
  });

  const canOpenRooms = !roomsOpened;
  const canEndSession = roomsOpened && !sessionEnded;

  return (
    <>
      <IconButton aria-label="구인 관리 메뉴" size="sm" onClick={() => setOpen(true)}>
        <MoreHorizontal size={18} aria-hidden />
      </IconButton>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title>구인 관리</Sheet.Title>
          <div className="flex flex-col">
            <Sheet.Item asChild onClick={() => setOpen(false)}>
              <Link href={`/games/${gameId}/edit`}>구인 수정</Link>
            </Sheet.Item>
            <Sheet.Item asChild onClick={() => setOpen(false)}>
              <Link href={`/games/${gameId}/participants`}>참여자 관리</Link>
            </Sheet.Item>
            {canOpenRooms && (
              <Sheet.Item onClick={openRooms} disabled={opening}>
                디스코드 세션 채널 열기
              </Sheet.Item>
            )}
            {canEndSession && (
              <Sheet.Item onClick={() => setConfirmingEnd(true)}>세션 종료</Sheet.Item>
            )}
            <Sheet.Item
              onClick={() => setConfirming(true)}
              className="font-semibold text-danger-600"
            >
              구인 삭제
            </Sheet.Item>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <ConfirmDialog
        open={confirmingEnd}
        onOpenChange={setConfirmingEnd}
        title="세션 종료"
        description="세션 채널에서 참여자 접근 권한을 모두 회수합니다. 기록은 GM만 읽을 수 있어요."
        confirmLabel="종료"
        pending={ending}
        onConfirm={endSession}
      />

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="구인 삭제"
        description="이 구인을 삭제할까요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        danger
        pending={pending}
        onConfirm={remove}
      />
    </>
  );
}
