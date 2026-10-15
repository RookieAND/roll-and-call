"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { DeleteMemoDialog } from "@/features/delete-staff-memo";
import { StaffMemoDialog } from "@/features/write-staff-memo";
import { MobileMoreSheet } from "@/shared/ui";

const MEMO_DIALOG = { edit: "edit", delete: "delete" } as const;
type MemoDialog = (typeof MEMO_DIALOG)[keyof typeof MEMO_DIALOG];

interface MemoRowSheetProps {
  userId: string;
  nickname: string;
  memo: { id: string; body: string };
}

// 데스크톱 행 메뉴(MoreMenu)를 모바일에서는 시트로 연다.
export function MemoRowSheet({ userId, nickname, memo }: MemoRowSheetProps) {
  const [dialog, setDialog] = useState<MemoDialog | null>(null);
  const closeDialog = (nextOpen: boolean) => nextOpen || setDialog(null);
  return (
    <>
      <MobileMoreSheet title="운영진 메모" triggerVariant="ghost">
        <Button variant="outline" size="lg" onClick={() => setDialog(MEMO_DIALOG.edit)}>
          고치기
        </Button>
        <Button
          variant="outline"
          colorPalette="danger"
          size="lg"
          onClick={() => setDialog(MEMO_DIALOG.delete)}
        >
          지우기
        </Button>
      </MobileMoreSheet>
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
