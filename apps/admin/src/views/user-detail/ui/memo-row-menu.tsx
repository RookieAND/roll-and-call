"use client";

import { Button, IconButton, Popover, VStack } from "@roll-and-call/ui";
import { Ellipsis, PencilLine, X } from "lucide-react";
import { useState } from "react";

import { DeleteMemoDialog } from "@/features/delete-staff-memo";
import { StaffMemoDialog } from "@/features/write-staff-memo";

const MEMO_DIALOG = { edit: "edit", delete: "delete" } as const;
type MemoDialog = (typeof MEMO_DIALOG)[keyof typeof MEMO_DIALOG];

interface MemoRowMenuProps {
  userId: string;
  nickname: string;
  memo: { id: string; body: string };
}

export function MemoRowMenu({ userId, nickname, memo }: MemoRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<MemoDialog | null>(null);
  const openDialog = (next: MemoDialog) => {
    setOpen(false);
    setDialog(next);
  };
  const closeDialog = (nextOpen: boolean) => nextOpen || setDialog(null);
  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={<IconButton variant="outline" size="sm" aria-label="메모 더 보기" />}
        >
          <Ellipsis size={16} aria-hidden />
        </Popover.Trigger>
        <Popover.Popup align="end" className="w-[130px] p-075">
          <VStack>
            <Button
              variant="ghost"
              colorPalette="gray"
              size="sm"
              onClick={() => openDialog(MEMO_DIALOG.edit)}
              className="justify-start gap-100"
            >
              <PencilLine size={16} aria-hidden />
              고치기
            </Button>
            <Button
              variant="ghost"
              colorPalette="danger"
              size="sm"
              onClick={() => openDialog(MEMO_DIALOG.delete)}
              className="justify-start gap-100"
            >
              <X size={16} aria-hidden />
              지우기
            </Button>
          </VStack>
        </Popover.Popup>
      </Popover.Root>
      {dialog === MEMO_DIALOG.edit ? (
        <StaffMemoDialog
          userId={userId}
          nickname={nickname}
          memo={memo}
          open
          onOpenChange={closeDialog}
        />
      ) : null}
      {dialog === MEMO_DIALOG.delete ? (
        <DeleteMemoDialog memoId={memo.id} open onOpenChange={closeDialog} />
      ) : null}
    </>
  );
}
