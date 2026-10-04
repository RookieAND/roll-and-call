import { Button, Dialog } from "@roll-and-call/ui";
import { RotateCcw, X } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail, ReviewModerationResult } from "@/shared/server";
import { ConflictNotice, ItemCard, ModalServerLabel, ServerLink } from "@/shared/ui";

import { ACTION_COPY, CONFLICT_VERB } from "../model/action-copy";
import type { ReviewAction } from "../model/review-action";

interface ReviewFailureContentProps {
  review: ReviewDetail;
  action: ReviewAction;
  failure: Extract<ReviewModerationResult, { ok: false }>;
  listHref: string;
}

export function ReviewFailureContent({
  review,
  action,
  failure,
  listHref,
}: ReviewFailureContentProps) {
  if (failure.gone) {
    const { deleted } = failure;
    const nextHref = review.nextId ? `/reviews/${review.nextId}` : listHref;
    return (
      <>
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>후기를 찾을 수 없습니다</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <ItemCard
            icon={X}
            title="작성자가 삭제한 후기입니다"
            meta={deleted ? `${deleted.author} · ${formatDateTime(deleted.at)} 삭제` : undefined}
          ></ItemCard>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />}>닫기</Dialog.Close>
          <Button render={<ServerLink path={nextHref} />}>다음 건</Button>
        </Dialog.Footer>
      </>
    );
  }
  const { conflict } = failure;
  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{ACTION_COPY[action].title(review.author.nickname)}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <ConflictNotice
          title={
            conflict
              ? `다른 운영진(${conflict.by})이 먼저 ${CONFLICT_VERB[conflict.action] ?? "처리"}했습니다`
              : "다른 운영진이 먼저 처리했습니다"
          }
          description={
            conflict
              ? `${formatDateTime(conflict.at)}에 처리되어 더 조치할 수 없습니다.`
              : "더 조치할 수 없습니다."
          }
          actions={
            <Button size="sm" render={<ServerLink path={listHref} />}>
              <RotateCcw size={14} aria-hidden />
              목록 새로고침
            </Button>
          }
        />
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />}>닫기</Dialog.Close>
      </Dialog.Footer>
    </>
  );
}
