"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { AddStaffDialog } from "@/features/add-staff";
import { RemoveStaffDialog } from "@/features/remove-staff";
import type { StaffCandidate, StaffRow } from "@/shared/server";

interface StaffDialogsProps {
  candidates: StaffCandidate[];
  removing?: StaffRow;
}

export function StaffDialogs({ candidates, removing }: StaffDialogsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const close = () => window.history.replaceState(null, "", pathname);

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
          key={removing.userId}
          staff={removing}
          open={action === "remove"}
          onOpenChange={(open) => open || close()}
        />
      ) : null}
    </>
  );
}
