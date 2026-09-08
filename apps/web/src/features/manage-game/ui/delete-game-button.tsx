"use client";

import { Button, cn } from "@trpg/ui";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/ui";
import { useDeleteGame } from "../model/use-delete-game";

export function DeleteGameButton({
  gameId,
  label = "삭제",
  className,
}: {
  gameId: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { pending, remove } = useDeleteGame(gameId, () => setOpen(false));

  return (
    <>
      <Button
        type="button"
        variant="danger"
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
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
