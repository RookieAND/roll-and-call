import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import type { ShotKey } from "@/shared/server";
import { Tag } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { isShotKey } from "../model/is-shot-key";
import { MOBILE_PHOTO_SECTION_ID } from "../model/section-ids";
import type { ReviewShot, ReviewShotKey } from "../model/shots";
import { MobileShotCard } from "./mobile-shot-card";

interface MobileShotSectionProps {
  state: CertReviewState;
  ebook: boolean;
  grouped: boolean;
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

// 사진은 한 줄에 하나씩 쌓는다. 묶음 신청은 옆으로 넘겨 본다.
export function MobileShotSection({
  state,
  ebook,
  grouped,
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
}: MobileShotSectionProps) {
  const done = checkedShots.length === checkableCount;
  return (
    <VStack
      gap="100"
      render={<section id={MOBILE_PHOTO_SECTION_ID} aria-labelledby="mobile-shot-section-title" />}
      aria-disabled={!reviewable}
      className={cn(state === CERT_REVIEW_STATE.waiting && "opacity-50")}
    >
      <HStack align="center" gap="100">
        <Text typography="heading3" render={<h2 id="mobile-shot-section-title" />}>
          {ebook ? "구매 기록 확인" : "사진 확인"}
        </Text>
        {proofDeleted ? (
          <Tag>사진 삭제됨</Tag>
        ) : (
          <Tag
            tone={done ? "success" : "gray"}
          >{`확인 ${checkedShots.length} / ${checkableCount}`}</Tag>
        )}
      </HStack>
      <VStack
        gap="125"
        className={cn(grouped && "-mx-150 snap-x snap-mandatory flex-row overflow-x-auto px-150")}
      >
        {shots.map((shot) => {
          const checked = checkedShots.includes(shot.key);
          const flagged = rejecting && isShotKey(shot.key) && flaggedShots.includes(shot.key);
          return (
            <MobileShotCard
              key={shot.key}
              label={shot.label}
              note={shot.note}
              question={shot.question}
              url={photoUrls[shot.key]}
              fresh={freshLabels[shot.key]}
              deleted={proofDeleted}
              checked={checked}
              disabled={!reviewable || pending}
              flagged={flagged}
              flaggable={rejecting && !ebook && !grouped && (!checked || flagged)}
              compact={grouped}
              onCheckedChange={() => onToggleCheck(shot.key)}
              onFlagToggle={() => isShotKey(shot.key) && onToggleFlag(shot.key)}
              onZoom={() => onZoom(shot.key)}
            />
          );
        })}
      </VStack>
      {grouped ? (
        <Text typography="body4" foreground="hint">
          {`옆으로 넘겨 ${shots.length}장을 모두 확인해 주세요`}
        </Text>
      ) : null}
    </VStack>
  );
}
