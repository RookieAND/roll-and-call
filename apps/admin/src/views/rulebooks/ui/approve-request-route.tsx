"use client";

import { useRouter } from "next/navigation";

import { ApproveRequestDialog } from "@/features/write-rulebook";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

interface ApproveRequestRouteProps {
  request: RulebookRequestRow | null;
  rulebooks: RulebookRow[];
  closeHref: string;
}

export function ApproveRequestRoute({ request, rulebooks, closeHref }: ApproveRequestRouteProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  return (
    <ApproveRequestDialog
      request={request}
      rulebooks={rulebooks}
      onClose={() => router.replace(toServerPath(closeHref), { scroll: false })}
    />
  );
}
