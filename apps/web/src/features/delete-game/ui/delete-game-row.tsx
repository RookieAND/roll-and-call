"use client";

import { Button, Text } from "@trpg/ui";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/shared/ui";

import { useDeleteGame } from "../model/use-delete-game";

interface DeleteGameRowProps {
  gameId: string;
  confirmedCount: number;
}

// 삭제는 관리 화면에서 바로 부르고 확인 다이얼로그 하나만 거친다. 시트를 한 겹 더 두지 않는다.
export function DeleteGameRow({ gameId, confirmedCount }: DeleteGameRowProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, remove } = useDeleteGame(gameId, () => setConfirming(false));

  const participantLine =
    confirmedCount > 0
      ? `\n확정 참여자 ${confirmedCount}명에게 삭제 사실이 따로 전해지지 않습니다.`
      : "";
  const description = `이 구인을 삭제할까요? 되돌릴 수 없습니다.${participantLine}\n\n디스코드 공지·스레드·세션 채널은 그대로 남습니다. 앱에서만 사라집니다.`;

  return (
    <>
      <Button
        variant="ghost"
        className="flex min-h-[60px] w-full justify-start gap-150 rounded-none border-t border-gray-100 px-175 py-150 hover:bg-danger-50"
        onClick={() => setConfirming(true)}
      >
        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-400 bg-danger-50 text-danger-600">
          <Trash2 size={18} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <Text typography="subtitle1" foreground="danger" className="block">
            구인 삭제
          </Text>
          <Text weight="regular" typography="body3" foreground="hint" className="mt-025 block">
            디스코드 공지·채널은 남습니다
          </Text>
        </span>
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="구인 삭제"
        description={description}
        confirmLabel="삭제"
        danger
        pending={pending}
        onConfirm={remove}
      />
    </>
  );
}
