"use client";

import { AlertDialog, Dialog, toast } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { conflictToastText } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { ACTION_COPY } from "../model/action-copy";
import { REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import type { ReviewModerationOutcome } from "../model/review-moderation-outcome";
import { ReviewGoneContent } from "./review-gone-content";
import { ReviewHideForm } from "./review-hide-form";
import { ReviewRemoveForm } from "./review-remove-form";
import { ReviewUnhideForm } from "./review-unhide-form";

const CONFLICT_TARGET = "후기";
const REMOVED_ACTION = "후기 제거";
const GONE_WIDTH = "max-w-[520px]";

type Gone = Extract<ReviewModerationOutcome, { gone: true }>;

interface ReviewActionDialogProps {
  review: ReviewDetail;
  availableActions: ReviewAction[];
  closeHref: string;
  // 들어온 목록(검색·구인 칩·정렬 유지). 제거·사라짐 뒤에 돌아간다.
  listHref: string;
  nextHref: string | undefined;
  viewerId: string;
}

// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다. 제거는 되돌릴 수 없어 AlertDialog로 연다.
// 충돌은 창 안에 두지 않는다. 창을 닫고 새로 읽은 뒤 토스트로만 알린다(D296).
export function ReviewActionDialog({
  review,
  availableActions,
  closeHref,
  listHref,
  nextHref,
  viewerId,
}: ReviewActionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const actionParam = useSearchParams().get("action");
  const action = availableActions.find((candidate) => candidate === actionParam) ?? null;
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [shownAction, setShownAction] = useState(action);
  const [gone, setGone] = useState<Gone | null>(null);
  if (action && action !== shownAction) {
    setShownAction(action);
    setGone(null);
  }
  const close = () => window.history.replaceState(null, "", toServerPath(closeHref));
  const backToList = () => {
    router.push(toServerPath(listHref));
    router.refresh();
  };
  const conflictToast = (outcome: Exclude<ReviewModerationOutcome, { ok: true }> | null) => {
    const conflict = outcome && !outcome.gone ? outcome.conflict : null;
    const self = conflict?.byId === viewerId;
    toast.info(conflictToastText({ conflict, self, target: CONFLICT_TARGET }));
    return conflict;
  };
  const settle = (outcome: ReviewModerationOutcome) => {
    if (outcome.ok) {
      if (shownAction === REVIEW_ACTION.remove) router.push(toServerPath(listHref));
      else close();
      return;
    }
    if (outcome.gone) {
      setGone(outcome);
      return;
    }
    const conflict = conflictToast(outcome);
    if (conflict?.action === REMOVED_ACTION) {
      router.push(toServerPath(listHref));
      return;
    }
    close();
    router.refresh();
  };
  const settleUndo = (outcome: ReviewModerationOutcome | null) => {
    if (outcome && !outcome.ok) conflictToast(outcome);
    router.refresh();
  };

  const removing = shownAction === REVIEW_ACTION.remove && !gone;
  const Root = removing ? AlertDialog.Root : Dialog.Root;
  const width = gone ? GONE_WIDTH : shownAction && ACTION_COPY[shownAction].widthClassName;
  return (
    <Root open={!isNull(action)} onOpenChange={(open) => open || (gone ? backToList() : close())}>
      <Dialog.Popup
        size="lg"
        initialFocus={removing ? cancelRef : undefined}
        className={width || undefined}
      >
        {gone ? (
          <ReviewGoneContent deleted={gone.deleted} nextHref={nextHref} onClose={backToList} />
        ) : null}
        {!gone && shownAction === REVIEW_ACTION.hide ? (
          <ReviewHideForm review={review} onSettled={settle} onUndoSettled={settleUndo} />
        ) : null}
        {!gone && shownAction === REVIEW_ACTION.unhide ? (
          <ReviewUnhideForm review={review} onSettled={settle} />
        ) : null}
        {removing ? (
          <ReviewRemoveForm review={review} cancelRef={cancelRef} onSettled={settle} />
        ) : null}
      </Dialog.Popup>
    </Root>
  );
}
