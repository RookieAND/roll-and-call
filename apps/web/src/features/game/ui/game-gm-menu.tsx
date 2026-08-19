"use client";

import { IconButton } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/shared/lib/toast";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { Sheet } from "@/shared/ui/sheet";
import { deleteGame } from "../api/delete-game";

// 4g: GM 본인 시점의 ⋯ 메뉴. 수정·삭제는 빈도가 낮고 파괴적이라
// 하단 액션 자리 대신 이 시트로 접는다. 삭제만 빨강 + 확인 다이얼로그.
export function GameGmMenu({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteGame(gameId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("삭제되었습니다");
      setConfirming(false);
      setOpen(false);
      if (result.redirect) router.push(result.redirect);
    });
  }

  return (
    <>
      <IconButton aria-label="구인 관리 메뉴" size="sm" onClick={() => setOpen(true)}>
        <MoreHorizontal size={18} aria-hidden />
      </IconButton>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title>구인 관리</Sheet.Title>
          <div className="flex flex-col">
            <Link
              href={`/games/${gameId}/edit`}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center border-b border-gray-100 text-[14.5px] text-gray-800"
            >
              구인 수정
            </Link>
            <Link
              href={`/games/${gameId}/participants`}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center border-b border-gray-100 text-[14.5px] text-gray-800"
            >
              참여자 관리
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex min-h-[52px] items-center text-left text-[14.5px] font-semibold text-red-600"
            >
              구인 삭제
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="구인 삭제"
        description="이 구인을 삭제할까요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        danger
        pending={pending}
        onConfirm={onDelete}
      />
    </>
  );
}
