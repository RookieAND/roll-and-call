"use client";

import { toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { normalizeInviteUrl, saveServerSettings } from "@/features/edit-server-settings";

export function useServerInfoForm({ savedInviteUrl }: { savedInviteUrl: string }) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);

  const inviteChanged = inviteUrl.trim() !== savedInviteUrl.trim();
  const invite = normalizeInviteUrl(inviteUrl);
  const inviteError = invite.ok ? undefined : invite.error;
  const canSave = inviteChanged && invite.ok && !saving;

  const save = () =>
    startSaving(async () => {
      const result = await saveServerSettings({ inviteUrl });
      if (!result.ok) return;
      toast.success("서버 정보를 저장했습니다");
      router.refresh();
    });

  return { saving, inviteUrl, setInviteUrl, inviteError, canSave, save };
}
