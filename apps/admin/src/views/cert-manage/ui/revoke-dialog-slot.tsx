"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { RevokeCertDialog } from "@/features/revoke-certification";
import type { RevokeTarget } from "@/shared/server";

interface RevokeDialogSlotProps {
  target: RevokeTarget;
  staffChannel: boolean;
}

// 창을 닫으면 action만 지운다. 창을 연 user·rulebook 필터는 표에 남는다(시안 cert_revoke_conflict).
export function RevokeDialogSlot({ target, staffChannel }: RevokeDialogSlotProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };
  return (
    <RevokeCertDialog
      key={`${target.userId}:${target.rulebookId}`}
      target={target}
      staffChannel={staffChannel}
      onClose={close}
    />
  );
}
