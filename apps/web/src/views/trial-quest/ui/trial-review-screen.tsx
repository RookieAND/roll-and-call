import type { ReactNode } from "react";

import type { TrialKind } from "../model/trial-kind";
import { TRIAL_REVIEW_SCREEN, type TrialReviewScreenName } from "../model/trial-review-screen";
import type { TrialReview } from "../model/trial-store";
import { TrialEndedSession } from "./trial-ended-session";
import { TrialReviewResult } from "./trial-review-result";

interface TrialReviewScreenProps {
  screen: TrialReviewScreenName;
  kind: TrialKind;
  forms: Record<string, ReactNode>;
  review: TrialReview | null;
  onOpen: (screen: TrialReviewScreenName) => void;
}

export function TrialReviewScreen({ screen, kind, forms, review, onOpen }: TrialReviewScreenProps) {
  if (screen === TRIAL_REVIEW_SCREEN.write || !review) return forms[kind];
  if (screen === TRIAL_REVIEW_SCREEN.result) {
    return (
      <TrialReviewResult
        kind={kind}
        review={review}
        onBack={() => onOpen(TRIAL_REVIEW_SCREEN.write)}
        onOpenSession={() => onOpen(TRIAL_REVIEW_SCREEN.session)}
      />
    );
  }
  return (
    <TrialEndedSession
      kind={kind}
      review={review}
      onBack={() => onOpen(TRIAL_REVIEW_SCREEN.result)}
    />
  );
}
