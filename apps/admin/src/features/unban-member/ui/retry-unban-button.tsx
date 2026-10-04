"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { retryGuildUnban } from "../api/retry-guild-unban";

interface RetryUnbanButtonProps {
  userId: string;
}

export function RetryUnbanButton({ userId }: RetryUnbanButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const retry = () =>
    startTransition(async () => {
      await retryGuildUnban(userId);
      router.refresh();
    });
  return (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      loading={pending}
      disabled={pending}
      onClick={retry}
    >
      다시 시도
    </Button>
  );
}
