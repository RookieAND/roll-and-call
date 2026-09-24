"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AddStaffDialog } from "@/features/add-staff";
import { RemoveStaffDialog } from "@/features/remove-staff";
import type { StaffCandidate, StaffRow } from "@/shared/server";

interface StaffDialogsProps {
  candidates: StaffCandidate[];
  removing?: StaffRow;
}

// 어떤 창이 열렸는지는 주소의 ?action=add|remove&staff= 로 정한다.
export function StaffDialogs({ candidates, removing }: StaffDialogsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const close = () => router.replace(pathname, { scroll: false });

  return (
    <>
      <AddStaffDialog
        key={String(action === "add")}
        candidates={candidates}
        searched={Boolean(searchParams.get("q"))}
        open={action === "add"}
        onOpenChange={(open) => open || close()}
      />
      {removing ? (
        <RemoveStaffDialog
          key={removing.nickname}
          staff={removing}
          open={action === "remove"}
          onOpenChange={(open) => open || close()}
        />
      ) : null}
    </>
  );
}
