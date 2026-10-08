"use client";

import { REVIEW_STATUS, GameDetail } from "@/widgets/game-detail";

import { TRIAL_VIEWER_ID } from "../model/build-trial-game";
import { buildTrialMyGame } from "../model/build-trial-my-game";
import type { TrialRecruit } from "../model/trial-store";
import { TrialBanner } from "./trial-banner";

interface TrialMyGameDetailProps {
  recruit: TrialRecruit;
  now: Date;
}

// 방금 등록한 체험 구인의 상세(GM 시점). 실제 구인 상세 컴포넌트를 그대로 쓴다.
export function TrialMyGameDetail({ recruit, now }: TrialMyGameDetailProps) {
  return (
    <GameDetail
      game={buildTrialMyGame({ recruit, now })}
      viewerId={TRIAL_VIEWER_ID}
      sanction={null}
      review={REVIEW_STATUS.unavailable}
      now={now}
      belowAppBar={<TrialBanner />}
    />
  );
}
