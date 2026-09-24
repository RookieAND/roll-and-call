"use client";

import { Button, Dialog, Textarea, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { saveStaffMemo } from "../api/save-staff-memo";

interface AddMemoDialogProps {
  userId: string;
  nickname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemoDialog({ userId, nickname, open, onOpenChange }: AddMemoDialogProps) {
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");

  const canSave = Boolean(body.trim()) && !pending;

  const save = () =>
    startTransition(async () => {
      await saveStaffMemo(userId, body);
      toast.success("메모를 남겼습니다");
      setBody("");
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[560px]">
        <Dialog.Header>
          <Dialog.Title>{nickname} 운영진 메모</Dialog.Title>
          <Dialog.Description>운영진 메모는 사용자에게 보이지 않습니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <Textarea
            aria-label="운영진 메모"
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canSave} onClick={save}>
            메모 저장
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
