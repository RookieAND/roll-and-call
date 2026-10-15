"use client";

import { Button, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useActionSubmit } from "@/shared/lib";

import { retryGuildUnban } from "../api/retry-guild-unban";

interface RetryUnbanButtonProps {
  userId: string;
}

export function RetryUnbanButton({ userId }: RetryUnbanButtonProps) {
  const router = useRouter();
  const { pending, submit } = useActionSubmit(retryGuildUnban);
  const retry = async () => {
    const result = await submit(userId);
    if (!result?.ok) {
      toast.danger("디스코드 차단 해제에 다시 실패했습니다.");
      return;
    }
    router.refresh();
  };
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
