"use client";

import { Button, Callout, Text, VStack } from "@roll-and-call/ui";
import { Ban } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog, IconTile } from "@/shared/ui";

import { useDeleteGame } from "../model/use-delete-game";

interface DeleteGameRowProps {
  gameId: string;
  confirmedCount: number;
  lockedReason?: string;
}

// 취소는 관리 화면에서 바로 부르고 확인 다이얼로그 하나만 거친다. 시트를 한 겹 더 두지 않는다.
export function DeleteGameRow({ gameId, confirmedCount, lockedReason }: DeleteGameRowProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, remove } = useDeleteGame(gameId, () => setConfirming(false));

  const participantLine =
    confirmedCount > 0
      ? `\n확정 참여자 ${confirmedCount}명에게 취소 사실이 디스코드로 전해집니다.`
      : "";
  const description = `이 구인을 취소할까요? 되돌릴 수 없습니다.${participantLine}`;
  const locked = Boolean(lockedReason);
  const labelForeground = locked ? "hint" : "danger";

  return (
    <>
      <Button
        variant="ghost"
        className="flex min-h-[60px] w-full justify-start gap-150 rounded-none border-t border-gray-100 px-175 py-150 hover:bg-danger-50 disabled:opacity-100"
        disabled={locked}
        onClick={() => setConfirming(true)}
      >
        <IconTile icon={Ban} tone={locked ? "locked" : "danger"} />
        <VStack gap="025" render={<span />} className="min-w-0 flex-1 text-left">
          <Text typography="subtitle1" foreground={labelForeground}>
            구인 취소
          </Text>
          <Text typography="body4" foreground="hint">
            {lockedReason ?? "구인을 취소하고 참여자에게 디스코드로 알립니다"}
          </Text>
        </VStack>
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="구인 취소"
        description={description}
        confirmLabel="구인 취소"
        cancelLabel="닫기"
        danger
        pending={pending}
        onConfirm={remove}
      >
        <Callout.Root size="sm" className="mt-150">
          <Callout.Description>
            <ul className="flex list-disc flex-col gap-050 pl-200 text-body4">
              <li>디스코드 모집 공지에 취소가 표시됩니다.</li>
              <li>모집 스레드와 세션 채널에 취소를 알립니다.</li>
              <li>채널은 지우지 않고 그대로 둡니다.</li>
            </ul>
          </Callout.Description>
        </Callout.Root>
      </ConfirmDialog>
    </>
  );
}
