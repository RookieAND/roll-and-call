"use client";

import type { RankingMode } from "@roll-and-call/database/servers/model";
import { toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { saveAdultOnlyEnabled, saveRankingMode } from "@/features/edit-server-settings";

interface UseServerOptionsFormOptions {
  savedRankingMode: RankingMode;
  savedAdultOnlyEnabled: boolean;
}

export function useServerOptionsForm({
  savedRankingMode,
  savedAdultOnlyEnabled,
}: UseServerOptionsFormOptions) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [rankingMode, setRankingMode] = useState(savedRankingMode);
  const [adultOnlyEnabled, setAdultOnlyEnabled] = useState(savedAdultOnlyEnabled);

  const rankingChanged = rankingMode !== savedRankingMode;
  const adultOnlyChanged = adultOnlyEnabled !== savedAdultOnlyEnabled;
  const canSave = (rankingChanged || adultOnlyChanged) && !saving;

  const save = () =>
    startSaving(async () => {
      if (rankingChanged) await saveRankingMode({ rankingMode });
      if (adultOnlyChanged) await saveAdultOnlyEnabled({ enabled: adultOnlyEnabled });
      toast.success("서버 설정을 저장했습니다");
      router.refresh();
    });

  return {
    saving,
    rankingMode,
    setRankingMode,
    adultOnlyEnabled,
    setAdultOnlyEnabled,
    rankingChanged,
    adultOnlyChanged,
    canSave,
    save,
  };
}
