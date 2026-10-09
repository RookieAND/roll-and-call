import { Grid, VStack, cn } from "@roll-and-call/ui";

import type { ShotKey } from "@/shared/server";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { isShotKey } from "../model/is-shot-key";
import type { ReviewShot, ReviewShotKey } from "../model/shots";
import { ShotCard } from "./shot-card";
import { ShotSectionHeader } from "./shot-section-header";

interface ShotSectionProps {
  state: CertReviewState;
  ebook: boolean;
  shots: readonly ReviewShot[];
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  freshLabels: Partial<Record<ReviewShotKey, string>>;
  proofDeleted: boolean;
  reviewable: boolean;
  rejecting: boolean;
  pending: boolean;
  checkedShots: ReviewShotKey[];
  checkableCount: number;
  flaggedShots: ShotKey[];
  onToggleCheck: (key: ReviewShotKey) => void;
  onToggleFlag: (key: ShotKey) => void;
  onZoom: (key: ReviewShotKey) => void;
}

export function ShotSection({
  state,
  ebook,
  shots,
  photoUrls,
  freshLabels,
  proofDeleted,
  reviewable,
  rejecting,
  pending,
  checkedShots,
  checkableCount,
  flaggedShots,
  onToggleCheck,
  onToggleFlag,
  onZoom,
}: ShotSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section aria-labelledby="shot-section-title" />}
      aria-disabled={!reviewable}
      className={cn(state === CERT_REVIEW_STATE.waiting && "opacity-50")}
    >
      <ShotSectionHeader
        title={ebook ? "구매 기록 확인" : "사진 확인"}
        checkedCount={checkedShots.length}
        total={checkableCount}
        deleted={proofDeleted}
      />
      <Grid className={cn("gap-150", shots.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {shots.map((shot, index) => {
          const checked = checkedShots.includes(shot.key);
          const flagged = rejecting && isShotKey(shot.key) && flaggedShots.includes(shot.key);
          return (
            <ShotCard
              key={shot.key}
              index={index}
              label={shot.label}
              note={shot.note}
              question={shot.question}
              url={photoUrls[shot.key]}
              fresh={freshLabels[shot.key]}
              deleted={proofDeleted}
              checked={checked}
              disabled={!reviewable || pending}
              flagged={flagged}
              flaggable={rejecting && !ebook && (!checked || flagged)}
              onCheckedChange={() => onToggleCheck(shot.key)}
              onFlagToggle={() => isShotKey(shot.key) && onToggleFlag(shot.key)}
              onZoom={() => onZoom(shot.key)}
            />
          );
        })}
      </Grid>
    </VStack>
  );
}
