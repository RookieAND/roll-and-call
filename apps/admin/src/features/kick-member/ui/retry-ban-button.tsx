"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { retryGuildBan } from "../api/retry-guild-ban";

interface RetryBanButtonProps {
  userId: string;
}

export function RetryBanButton({ userId }: RetryBanButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const retry = () =>
    startTransition(async () => {
      await retryGuildBan(userId);
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
