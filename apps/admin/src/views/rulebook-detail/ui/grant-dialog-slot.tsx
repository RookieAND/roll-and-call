"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GrantGmDialog } from "@/features/grant-certification";
import type { GrantCandidate } from "@/shared/server";

interface GrantDialogSlotProps {
  rulebookId: string;
  rulebookLabel: string;
  categoryEdition: string;
  candidates: GrantCandidate[];
}

// 창이 열렸는지는 주소의 ?action=grant로 정하고, 닫으면 검색어를 지우고 인증 현황 탭으로 돌아간다.
export function GrantDialogSlot({
  rulebookId,
  rulebookLabel,
  categoryEdition,
  candidates,
}: GrantDialogSlotProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = searchParams.get("action") === "grant";
  return (
    <GrantGmDialog
      key={String(open)}
      rulebookId={rulebookId}
      rulebookLabel={rulebookLabel}
      categoryEdition={categoryEdition}
      candidates={candidates}
      searched={Boolean(searchParams.get("q"))}
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) router.replace(`${pathname}?tab=gms`, { scroll: false });
      }}
    />
  );
}
