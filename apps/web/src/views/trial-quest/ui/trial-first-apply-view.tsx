import { GameDetail, REVIEW_STATUS } from "@/widgets/game-detail";

import { buildTrialGame, TRIAL_VIEWER_ID } from "../model/build-trial-game";
import { trialDetailKey } from "../model/trial-detail-key";
import { TRIAL_KIND } from "../model/trial-kind";
import { TrialBanner } from "./trial-banner";
import { TrialFirstApply } from "./trial-first-apply";

const KINDS = [TRIAL_KIND.firstCome, TRIAL_KIND.lottery] as const;

// 구인 상세는 서버에서 그려 슬롯으로 넘긴다. 실제 상세 컴포넌트가 서버 전용 모듈을 품고 있어 클라이언트 번들에 넣을 수 없다.
export function TrialFirstApplyView() {
  const now = new Date();
  const details = Object.fromEntries(
    KINDS.flatMap((kind) =>
      [false, true].map((applied) => [
        trialDetailKey({ kind, applied }),
        <GameDetail
          key={trialDetailKey({ kind, applied })}
          game={buildTrialGame({ kind, applied, now })}
          viewerId={TRIAL_VIEWER_ID}
          sanction={null}
          review={REVIEW_STATUS.unavailable}
          now={now}
          belowAppBar={<TrialBanner />}
        />,
      ]),
    ),
  );
  return <TrialFirstApply details={details} />;
}
