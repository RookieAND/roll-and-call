"use client";

import { AlertDialog, Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import type { ReviewDetail, ReviewModerationResult } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { ReviewActionForm } from "./review-action-form";
import { ReviewFailureContent } from "./review-failure-content";

type Failure = Extract<ReviewModerationResult, { ok: false }>;

const POPUP_WIDTH = {
  [REVIEW_ACTION.hide]: "max-w-[600px]",
  [REVIEW_ACTION.unhide]: "max-w-[600px]",
  [REVIEW_ACTION.remove]: "max-w-[600px]",
  [REVIEW_ACTION.dismiss]: "max-w-[560px]",
} as const;

const GONE_WIDTH = "max-w-[520px]";

interface ReviewActionDialogProps {
  review: ReviewDetail;
  action: ReviewAction | null;
  fromReports: boolean;
  closeHref: string;
  hideHref: string;
  listHref: string;
}

// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다. 제거는 되돌릴 수 없어 AlertDialog로 연다.
export function ReviewActionDialog({
  review,
  action,
  fromReports,
  closeHref,
  hideHref,
  listHref,
}: ReviewActionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [shownAction, setShownAction] = useState(action);
  const [failure, setFailure] = useState<Failure | null>(null);
  if (action && action !== shownAction) {
    setShownAction(action);
    setFailure(null);
  }
  const reviewLeft = Boolean(failure && (failure.gone || failure.conflict?.action === "후기 제거"));
  const close = () =>
    router.replace(toServerPath(reviewLeft ? listHref : closeHref), { scroll: false });
  const removing = shownAction === REVIEW_ACTION.remove;
  const Root = removing ? AlertDialog.Root : Dialog.Root;
  const actionWidth = shownAction ? POPUP_WIDTH[shownAction] : undefined;
  return (
    <Root open={!isNull(action)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup
        size="lg"
        initialFocus={removing ? cancelRef : undefined}
        className={failure?.gone ? GONE_WIDTH : actionWidth}
      >
        {shownAction && failure ? (
          <ReviewFailureContent
            review={review}
            action={shownAction}
            failure={failure}
            listHref={listHref}
          />
        ) : null}
        {shownAction && !failure ? (
          <ReviewActionForm
            key={shownAction}
            review={review}
            action={shownAction}
            fromReports={fromReports}
            cancelRef={cancelRef}
            onDone={close}
            onFailure={setFailure}
            onSwitchToHide={() => router.replace(toServerPath(hideHref), { scroll: false })}
          />
        ) : null}
      </Dialog.Popup>
    </Root>
  );
}
