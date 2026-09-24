"use client";

import { AlertDialog, Button, toast } from "@roll-and-call/ui";
import { useState, useTransition } from "react";

import { promoteToOwner } from "../api/promote-to-owner";

interface ChangeRoleButtonProps {
  nickname: string;
}

// ponytail: 소유자 역할은 되돌릴 수 없으므로(시안) 운영진 → 소유자 한 방향만 바꾼다.
export function ChangeRoleButton({ nickname }: ChangeRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const promote = () =>
    startTransition(async () => {
      await promoteToOwner(nickname);
      toast.success(`${nickname}님의 역할을 소유자로 바꿨습니다`);
      setOpen(false);
    });

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || setOpen(nextOpen)}>
      <AlertDialog.Trigger render={<Button variant="outline" colorPalette="gray" size="sm" />}>
        역할 변경
      </AlertDialog.Trigger>
      <AlertDialog.Popup className="max-w-[440px]">
        <AlertDialog.Header>
          <AlertDialog.Title>{nickname} 역할 변경</AlertDialog.Title>
          <AlertDialog.Description>
            소유자로 바꾸면 운영진 관리와 서비스 설정까지 할 수 있습니다. 소유자 역할은 변경할 수
            없습니다.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button loading={pending} onClick={promote}>
            소유자로 변경
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
