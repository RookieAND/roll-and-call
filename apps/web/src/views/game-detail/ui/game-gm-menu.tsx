"use client";

import { IconButton, Text } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog, Sheet } from "@/shared/ui";
import { useDeleteGame } from "@/features/delete-game";

// GM 본인 시점의 ⋯ 메뉴. 상세에는 글 자신에 대한 것(수정 · 참여자 관리 · 삭제)만 둔다.
// 디스코드 운영(세션 채널 열기·종료)은 참여자 관리 화면이 맡는다.
export function GameGmMenu({
  gameId,
  confirmedCount,
  waitingCount,
  canChangeTime,
}: {
  gameId: string;
  confirmedCount: number;
  waitingCount: number;
  // 조율형이고 이미 확정됐으면 확정 시간을 바꿀 수 있다(서버가 재확정을 받는다).
  canChangeTime: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { pending, remove } = useDeleteGame(gameId, () => {
    setConfirming(false);
    setOpen(false);
  });

  const rosterSummary = `확정 ${confirmedCount} · 대기 ${waitingCount}`;
  const deleteDescription =
    confirmedCount > 0
      ? `이 구인을 삭제할까요? 되돌릴 수 없습니다. 확정 참여자 ${confirmedCount}명에게 삭제 사실이 따로 전해지지 않습니다. 디스코드 공지·스레드·세션 채널은 그대로 남습니다.`
      : "이 구인을 삭제할까요? 되돌릴 수 없습니다. 디스코드 공지·스레드·세션 채널은 그대로 남습니다.";

  return (
    <>
      <IconButton aria-label="구인 관리 메뉴" className="h-11 w-11 -mr-2.5" onClick={() => setOpen(true)}>
        <MoreHorizontal size={20} aria-hidden />
      </IconButton>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title>구인 관리</Sheet.Title>
          <div className="flex flex-col">
            <Sheet.Item asChild onClick={() => setOpen(false)}>
              <Link href={`/games/${gameId}/edit`}>구인 수정</Link>
            </Sheet.Item>
            {canChangeTime && (
              <Sheet.Item asChild onClick={() => setOpen(false)}>
                <Link href={`/games/${gameId}/schedule`}>확정 시간 변경</Link>
              </Sheet.Item>
            )}
            <Sheet.Item asChild onClick={() => setOpen(false)}>
              <Link href={`/games/${gameId}/participants`}>
                참여자 관리
                <Text typography="body4" foreground="hint" render={<span />}>
                  {rosterSummary}
                </Text>
              </Link>
            </Sheet.Item>
            <Sheet.Item
              onClick={() => setConfirming(true)}
              className="flex-col items-start justify-center gap-0.5 py-2.5"
            >
              <span className="font-semibold text-danger-600">구인 삭제</span>
              <Text typography="body4" foreground="hint" render={<span />}>
                삭제하면 앱에서만 사라집니다. 디스코드 공지·스레드·세션 채널은 남습니다.
              </Text>
            </Sheet.Item>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="구인 삭제"
        description={deleteDescription}
        confirmLabel="삭제"
        danger
        pending={pending}
        onConfirm={remove}
      />
    </>
  );
}
