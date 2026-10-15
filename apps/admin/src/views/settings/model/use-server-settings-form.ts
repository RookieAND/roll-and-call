"use client";

import type { RankingMode } from "@roll-and-call/database/servers/model";
import { toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  normalizeInviteUrl,
  saveRankingMode,
  saveServerSettings,
} from "@/features/edit-server-settings";

interface UseServerSettingsFormOptions {
  savedInviteUrl: string;
  savedRankingMode: RankingMode;
}

// ponytail: 모바일 서버 설정 폼만 쓴다. 데스크톱 ServerSettingsForm은 같은 상태를 자기 안에 둔다(파일을 건드리지 않기로 해서). 둘을 맞출 때 데스크톱도 이 훅으로 옮긴다.
export function useServerSettingsForm({
  savedInviteUrl,
  savedRankingMode,
}: UseServerSettingsFormOptions) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [inviteUrl, setInviteUrl] = useState(savedInviteUrl);
  const [rankingMode, setRankingMode] = useState(savedRankingMode);

  const inviteChanged = inviteUrl.trim() !== savedInviteUrl.trim();
  const invite = normalizeInviteUrl(inviteUrl);
  const inviteError = invite.ok ? undefined : invite.error;
  const rankingChanged = rankingMode !== savedRankingMode;
  const canSave = (inviteChanged || rankingChanged) && invite.ok && !saving;

  const save = () =>
    startSaving(async () => {
      if (inviteChanged) {
        const result = await saveServerSettings({ inviteUrl });
        if (!result.ok) return;
      }
      if (rankingChanged) await saveRankingMode({ rankingMode });
      toast.success("서버 설정을 저장했습니다");
      router.refresh();
    });

  return {
    saving,
    inviteUrl,
    setInviteUrl,
    inviteError,
    rankingMode,
    setRankingMode,
    canSave,
    save,
  };
}
