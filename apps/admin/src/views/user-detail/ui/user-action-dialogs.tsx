"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EditNicknameDialog } from "@/features/edit-nickname";
import { KickMemberDialog } from "@/features/kick-member";
import { ReleaseSanctionDialog } from "@/features/release-sanction";
import { UnbanMemberDialog } from "@/features/unban-member";
import { StaffMemoDialog } from "@/features/write-staff-memo";
import type { KickImpact, UserDetail } from "@/shared/server";

import { USER_ACTION } from "../model/user-action";

interface UserActionDialogsProps {
  user: UserDetail;
  // 추방 모달을 열 때만 읽는다. 추방할 수 없는 유저면 null.
  kickImpact: KickImpact | null;
}

export function UserActionDialogs({ user, kickImpact }: UserActionDialogsProps) {
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
      <StaffMemoDialog
        userId={user.id}
        nickname={user.nickname}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  if (action === USER_ACTION.nickname) {
    return (
      <EditNicknameDialog
        userId={user.id}
        nickname={user.nickname}
        discordHandle={user.discordHandle}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  if (action === USER_ACTION.kick && kickImpact && !user.ban) {
    return (
      <KickMemberDialog
        userId={user.id}
        nickname={user.nickname}
        discordHandle={user.discordHandle}
        impact={kickImpact}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  if (action === USER_ACTION.unban && user.ban) {
    return (
      <UnbanMemberDialog
        userId={user.id}
        nickname={user.nickname}
        ban={user.ban}
        open
        onOpenChange={handleOpenChange}
      />
    );
  }
  return null;
}
