"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AddMemoDialog } from "@/features/add-staff-memo";
import { ReleaseSanctionDialog } from "@/features/release-sanction";
import { SanctionDialog } from "@/features/sanction-user";
import type { StaffRole, UserDetail } from "@/shared/server";

import { USER_ACTION } from "../model/user-action";

interface UserActionDialogsProps {
  user: UserDetail;
  viewer: { nickname: string; role: StaffRole };
}

// 조치 모달은 주소의 action으로 연다. 닫으면 action만 지운다.
export function UserActionDialogs({ user, viewer }: UserActionDialogsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  if (action === USER_ACTION.sanction && !user.sanction) {
    return (
      <SanctionDialog
        userId={user.id}
        nickname={user.nickname}
        ongoing={user.ongoing}
        viewer={viewer}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  if (action === USER_ACTION.release && user.sanction) {
    return (
      <ReleaseSanctionDialog
        userId={user.id}
        nickname={user.nickname}
        sanction={user.sanction}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  if (action === USER_ACTION.memo) {
    return (
      <AddMemoDialog
        userId={user.id}
        nickname={user.nickname}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  return null;
}
