"use client";

import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
import { Button, Text, VStack } from "@roll-and-call/ui";

import { MobileActionBar } from "@/shared/ui";

import { adultOnlyFeatureNote } from "../model/adult-only-feature-note";
import { ADULT_ONLY_DESCRIPTION, POINTS_DESCRIPTION } from "../model/feature-descriptions";
import { rankingFeatureNote } from "../model/ranking-feature-note";
import { useServerOptionsForm } from "../model/use-server-options-form";
import { FeatureRow } from "./feature-row";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";
import { MobileSettingsSection } from "./mobile/mobile-settings-section";

interface ServerOptionsMobileFormProps {
  savedRankingMode: RankingMode;
  savedAdultOnlyEnabled: boolean;
}

export function ServerOptionsMobileForm({
  savedRankingMode,
  savedAdultOnlyEnabled,
}: ServerOptionsMobileFormProps) {
  const form = useServerOptionsForm({ savedRankingMode, savedAdultOnlyEnabled });

  return (
    <MobileSettingsFrame active="/settings/options">
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <MobileSettingsSection title="서버 기능">
          <Text typography="body3" foreground="muted" render={<p />}>
            서버마다 쓸 기능을 켜고 끕니다.
          </Text>
          <FeatureRow
            id="mobile-feature-points"
            label="점수제"
            description={POINTS_DESCRIPTION}
            checked={form.rankingMode === RANKING_MODE.points}
            note={form.rankingChanged ? rankingFeatureNote(form.rankingMode) : undefined}
            disabled={form.saving}
            showState={false}
            onCheckedChange={(checked) =>
              form.setRankingMode(checked ? RANKING_MODE.points : RANKING_MODE.count)
            }
          />
          <FeatureRow
            id="mobile-feature-adult-only"
            label="성인 전용 구인 표기"
            description={ADULT_ONLY_DESCRIPTION}
            checked={form.adultOnlyEnabled}
            note={form.adultOnlyChanged ? adultOnlyFeatureNote(form.adultOnlyEnabled) : undefined}
            disabled={form.saving}
            showState={false}
            onCheckedChange={form.setAdultOnlyEnabled}
          />
        </MobileSettingsSection>
      </VStack>
      <MobileActionBar>
        <Button
          size="lg"
          loading={form.saving}
          disabled={!form.canSave}
          onClick={form.save}
          className="text-body2"
        >
          변경 저장
        </Button>
      </MobileActionBar>
    </MobileSettingsFrame>
  );
}
