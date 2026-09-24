"use client";

import { Button, toast } from "@roll-and-call/ui";
import { useTransition } from "react";

import { sendGuideDm } from "../api/send-guide-dm";

interface GuideDmButtonProps {
  userId: string;
  nickname: string;
  disabled: boolean;
}

export function GuideDmButton({ userId, nickname, disabled }: GuideDmButtonProps) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      disabled={disabled}
      loading={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await sendGuideDm(userId);
          if (result.ok) toast.success(`${nickname}님에게 안내 DM을 보냈습니다`);
          else toast.danger(result.error);
        })
      }
    >
      안내 DM
    </Button>
  );
}
