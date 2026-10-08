import { reviewEditDeadline } from "@/entities/review";
import { ReviewForm } from "@/features/write-review";

import { TRIAL_GAME_TITLE } from "../model/trial-copy";
import { TRIAL_KIND } from "../model/trial-kind";
import { TRIAL_REVIEW_GAME_ID } from "../model/trial-session";
import { TrialBanner } from "./trial-banner";
import { TrialFirstReview } from "./trial-first-review";

const KINDS = [TRIAL_KIND.firstCome, TRIAL_KIND.lottery] as const;

// 후기 작성 폼은 실제 컴포넌트를 서버에서 그려 슬롯으로 넘긴다. 쓰기 동작은 체험 핸들러가 가로챈다.
export function TrialFirstReviewView() {
  const editUntil = reviewEditDeadline(new Date());
  const forms = Object.fromEntries(
    KINDS.map((kind) => [
      kind,
      <ReviewForm
        key={kind}
        serverId="trial-server"
        gameId={TRIAL_REVIEW_GAME_ID}
        heading={{
          title: TRIAL_GAME_TITLE[kind],
          rule: "CoC 7th",
          subline: "체험용 끝난 세션 · 후기 작성 기간 7일",
        }}
        review={null}
        editUntil={editUntil}
        initialBlock={null}
        belowAppBar={<TrialBanner />}
      />,
    ]),
  );
  return <TrialFirstReview forms={forms} />;
}
