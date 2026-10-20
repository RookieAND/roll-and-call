"use client";

import type { RankingMode } from "@roll-and-call/database/servers/model";
import { Button, VStack } from "@roll-and-call/ui";

import { useServerOptionsForm } from "../model/use-server-options-form";
import { ServerFeaturePanel } from "./server-feature-panel";
import { SettingsFrame } from "./settings-frame";

interface ServerOptionsFormProps {
  savedRankingMode: RankingMode;
  savedAdultOnlyEnabled: boolean;
}

export function ServerOptionsForm({
  savedRankingMode,
  savedAdultOnlyEnabled,
}: ServerOptionsFormProps) {
  const form = useServerOptionsForm({ savedRankingMode, savedAdultOnlyEnabled });
  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/options"
      actions={
        <Button loading={form.saving} disabled={!form.canSave} onClick={form.save}>
          변경 저장
        </Button>
      }
    >
      <VStack gap="150" className="max-w-[880px]">
        <ServerFeaturePanel
          rankingMode={form.rankingMode}
          savedRankingMode={savedRankingMode}
          adultOnlyEnabled={form.adultOnlyEnabled}
          savedAdultOnlyEnabled={savedAdultOnlyEnabled}
          disabled={form.saving}
          onRankingModeChange={form.setRankingMode}
          onAdultOnlyEnabledChange={form.setAdultOnlyEnabled}
        />
      </VStack>
    </SettingsFrame>
  );
}
