"use client";

import { Button, HStack, toast } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { RulebookRequestRow } from "@/shared/server";

import { approveRequest } from "../api/approve-request";
import { conflictTitle } from "../model/conflict-title";

interface RequestActionsProps {
  request: RulebookRequestRow;
  linkHref: string;
  rejectHref: string;
}

// [추가]는 확인 없이 바로 실행하고, 연결·반려는 주소의 action으로 창을 연다.
export function RequestActions({ request, linkHref, rejectHref }: RequestActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const approve = () =>
    startTransition(async () => {
      const result = await approveRequest(request.id);
      if (result.ok) toast.success(`「${request.name}」 룰북을 추가했습니다`);
      else toast.info(conflictTitle(result.conflict));
      router.refresh();
    });

  return (
    <HStack align="center" gap="075">
      <Button size="sm" loading={pending} disabled={pending} onClick={approve} className="gap-050">
        <Plus size={14} aria-hidden />
        추가
      </Button>
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        disabled={pending}
        render={<Link href={linkHref} scroll={false} />}
      >
        기존 룰북에 연결
      </Button>
      <Button
        variant="outline"
        colorPalette="danger"
        size="sm"
        disabled={pending}
        render={<Link href={rejectHref} scroll={false} />}
      >
        반려
      </Button>
    </HStack>
  );
}
