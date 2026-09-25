"use client";

import { useRouter } from "next/navigation";

import { ApproveRequestDialog } from "@/features/write-rulebook";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";

interface ApproveRequestRouteProps {
  request: RulebookRequestRow | null;
  rulebooks: RulebookRow[];
  closeHref: string;
}

// 주소의 ?action=add&request= 로 연다.
export function ApproveRequestRoute({ request, rulebooks, closeHref }: ApproveRequestRouteProps) {
  const router = useRouter();
  return (
    <ApproveRequestDialog
      request={request}
      rulebooks={rulebooks}
      onClose={() => router.replace(closeHref, { scroll: false })}
    />
  );
}
