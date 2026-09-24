"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GrantGmDialog } from "@/features/grant-certification";
import type { GrantCandidate } from "@/shared/server";

interface GrantDialogSlotProps {
  rulebookId: string;
  rulebookLabel: string;
  candidates: GrantCandidate[];
}

// 창이 열렸는지는 주소의 ?action=grant로 정하고, 닫으면 검색어도 함께 지운다.
export function GrantDialogSlot({ rulebookId, rulebookLabel, candidates }: GrantDialogSlotProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = searchParams.get("action") === "grant";
  return (
    <GrantGmDialog
      key={String(open)}
      rulebookId={rulebookId}
      rulebookLabel={rulebookLabel}
      candidates={candidates}
      searched={Boolean(searchParams.get("q"))}
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) router.replace(pathname, { scroll: false });
      }}
    />
  );
}
