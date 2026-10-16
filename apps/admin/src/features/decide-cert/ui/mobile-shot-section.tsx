import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import type { ShotKey } from "@/shared/server";
import { Tag } from "@/shared/ui";

import { CERT_REVIEW_STATE, type CertReviewState } from "../model/cert-review-state";
import { isShotKey } from "../model/is-shot-key";
import { MOBILE_PHOTO_SECTION_ID } from "../model/section-ids";
import type { ReviewShot, ReviewShotKey } from "../model/shots";
import { MobileShotRow } from "./mobile-shot-row";

interface MobileShotSectionProps {
  state: CertReviewState;
  ebook: boolean;
  grouped: boolean;
  shots: readonly ReviewShot[];
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  proofDeleted: boolean;
  reviewable: boolean;
  rejecting: boolean;
  pending: boolean;
  checkedShots: ReviewShotKey[];
  checkableCount: number;
  flaggedShots: ShotKey[];
  onToggleFlag: (key: ShotKey) => void;
  onZoom: (key: ReviewShotKey) => void;
}

// 사진은 한 줄에 한 장씩 작은 목록으로 보인다. 줄을 누르면 확대 화면이 열리고 확인 체크는 그곳에서 한다.
export function MobileShotSection({
  state,
  ebook,
  grouped,
  shots,
  photoUrls,
  proofDeleted,
  reviewable,
  rejecting,
  pending,
  checkedShots,
  checkableCount,
  flaggedShots,
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
        render={<div />}
        className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
      >
        {shots.map((shot) => {
          const checked = checkedShots.includes(shot.key);
          const flagged = rejecting && isShotKey(shot.key) && flaggedShots.includes(shot.key);
          return (
            <MobileShotRow
              key={shot.key}
              label={shot.label}
              note={shot.note}
              url={proofDeleted ? undefined : photoUrls[shot.key]}
              checked={checked}
              flagged={flagged}
              flaggable={rejecting && !ebook && !grouped && (!checked || flagged)}
              rejecting={rejecting}
              disabled={!reviewable || pending}
              onFlagToggle={() => isShotKey(shot.key) && onToggleFlag(shot.key)}
              onZoom={() => onZoom(shot.key)}
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
