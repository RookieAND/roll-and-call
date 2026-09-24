"use client";

import { Button, HStack, Popover, VStack, toast } from "@roll-and-call/ui";
import { ChevronDown, Link2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    { label: "기존 룰북에 연결", icon: Link2, href: linkHref },
    { label: "반려", icon: X, href: rejectHref },
  ];

  const approve = () =>
    startTransition(async () => {
      const result = await approveRequest(request.id);
      if (result.ok) toast.success(`「${request.name}」 룰북을 추가했습니다`);
      else toast.info(conflictTitle(result.conflict));
      router.refresh();
    });

  return (
    <HStack align="center" gap="075">
      <Button size="sm" loading={pending} disabled={pending} onClick={approve}>
        추가
      </Button>
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger
          disabled={pending}
          render={<Button variant="outline" colorPalette="gray" size="sm" className="gap-075" />}
        >
          다른 처리
          <ChevronDown size={14} aria-hidden />
        </Popover.Trigger>
        <Popover.Popup align="end" className="w-[180px] p-075">
          <VStack>
            {items.map(({ label, icon: Icon, href }) => (
              <Button
                key={label}
                variant="ghost"
                colorPalette="gray"
                size="sm"
                render={<Link href={href} scroll={false} />}
                onClick={() => setMenuOpen(false)}
                className="justify-start gap-100"
              >
                <Icon size={16} aria-hidden />
                {label}
              </Button>
            ))}
          </VStack>
        </Popover.Popup>
      </Popover.Root>
    </HStack>
  );
}
