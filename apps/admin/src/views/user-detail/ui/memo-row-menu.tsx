"use client";

import { PencilLine, X } from "lucide-react";
import { useState } from "react";

import { DeleteMemoDialog } from "@/features/delete-staff-memo";
import { StaffMemoDialog } from "@/features/write-staff-memo";
import { MoreMenu } from "@/shared/ui";

const MEMO_DIALOG = { edit: "edit", delete: "delete" } as const;
type MemoDialog = (typeof MEMO_DIALOG)[keyof typeof MEMO_DIALOG];

interface MemoRowMenuProps {
  userId: string;
  nickname: string;
  memo: { id: string; body: string };
}

export function MemoRowMenu({ userId, nickname, memo }: MemoRowMenuProps) {
  const [dialog, setDialog] = useState<MemoDialog | null>(null);
  const closeDialog = (nextOpen: boolean) => nextOpen || setDialog(null);
  return (
    <>
      <MoreMenu
        label="메모 더 보기"
        widthClassName="w-[130px]"
        items={[
          {
            label: "고치기",
            icon: PencilLine,
            onSelect: () => setDialog(MEMO_DIALOG.edit),
          },
          {
            label: "지우기",
            icon: X,
            danger: true,
            onSelect: () => setDialog(MEMO_DIALOG.delete),
          },
        ]}
      />
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
