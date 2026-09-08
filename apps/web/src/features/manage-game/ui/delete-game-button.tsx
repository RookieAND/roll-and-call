"use client";

import { Button, cn } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast, ConfirmDialog } from "@/shared/ui";
import { deleteGame } from "../api/delete-game";

export function DeleteGameButton({
  gameId,
  label = "삭제",
  className,
}: {
  gameId: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await deleteGame(gameId);
      if (result.error) {
        toast.error(result.error);
        setOpen(false);
        return;
      }
      toast.success("삭제되었습니다");
      setOpen(false);
      if (result.redirect) router.push(result.redirect);
    });
  }

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
        onConfirm={onConfirm}
      />
    </>
  );
}
