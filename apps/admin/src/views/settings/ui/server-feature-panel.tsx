"use client";

import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

import { Panel } from "@/shared/ui";

import { adultOnlyFeatureNote } from "../model/adult-only-feature-note";
import { ADULT_ONLY_DESCRIPTION, POINTS_DESCRIPTION } from "../model/feature-descriptions";
import { rankingFeatureNote } from "../model/ranking-feature-note";
import { FeatureRow } from "./feature-row";

interface ServerFeaturePanelProps {
  rankingMode: RankingMode;
  savedRankingMode: RankingMode;
  adultOnlyEnabled: boolean;
  savedAdultOnlyEnabled: boolean;
  disabled?: boolean;
  onRankingModeChange: (mode: RankingMode) => void;
  onAdultOnlyEnabledChange: (enabled: boolean) => void;
}

export function ServerFeaturePanel({
  rankingMode,
  savedRankingMode,
  adultOnlyEnabled,
  savedAdultOnlyEnabled,
  disabled = false,
  onRankingModeChange,
  onAdultOnlyEnabledChange,
}: ServerFeaturePanelProps) {
  const rankingNote =
    rankingMode !== savedRankingMode ? rankingFeatureNote(rankingMode) : undefined;
  const adultNote =
    adultOnlyEnabled !== savedAdultOnlyEnabled ? adultOnlyFeatureNote(adultOnlyEnabled) : undefined;
  return (
    <Panel
      title="서버 기능"
      description="서버마다 쓸 기능을 켜고 끕니다."
      bodyClassName="flex flex-col gap-200 p-175"
    >
      <FeatureRow
        id="feature-points"
        label="점수제"
        description={POINTS_DESCRIPTION}
        checked={rankingMode === RANKING_MODE.points}
        note={rankingNote}
        disabled={disabled}
        onCheckedChange={(checked) =>
          onRankingModeChange(checked ? RANKING_MODE.points : RANKING_MODE.count)
        }
      />
      <FeatureRow
        id="feature-adult-only"
        label="성인 전용 구인 표기"
        description={ADULT_ONLY_DESCRIPTION}
        checked={adultOnlyEnabled}
        note={adultNote}
        disabled={disabled}
        onCheckedChange={onAdultOnlyEnabledChange}
      />
    </Panel>
  );
}
