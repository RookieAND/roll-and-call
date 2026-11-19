"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useServerPath } from "@/shared/lib";
import { ConfirmDialog, LineBreaks, toast, toastActionError, useAction } from "@/shared/ui";

import { skipRound } from "../api/skip-round";
import { skipRoundLines } from "../model/skip-round-lines";

interface SkipRoundButtonProps {
  gameId: string;
  roundNo: number;
  roundCount: number;
  designated: boolean;
  reviewCount: number;
}

export function SkipRoundButton({
  gameId,
  roundNo,
  roundCount,
  designated,
  reviewCount,
}: SkipRoundButtonProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();
  const lines = skipRoundLines({ designated, roundCount, reviewCount });

  function confirm() {
    run(() => skipRound({ gameId, roundNo }), {
      onSuccess: () => {
        setOpen(false);
        toast.success(`${roundNo}회차를 생략했습니다.`);
        router.push(toServerPath(`/games/${gameId}/rounds`));
      },
      onError: (result) => {
        setOpen(false);
        toastActionError(result);
      },
    });
  }

  return (
    <>
      <Button variant="ghost" colorPalette="gray" size="sm" onClick={() => setOpen(true)}>
        이 회차 생략하기
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`${roundNo}회차를 생략하시겠습니까`}
        description={<LineBreaks lines={lines} />}
        confirmLabel="생략하기"
        confirmColorPalette="danger"
        pending={pending}
        onConfirm={confirm}
      />
    </>
  );
}
