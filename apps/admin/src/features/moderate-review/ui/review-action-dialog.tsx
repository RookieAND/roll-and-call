"use client";

import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ReviewDetail } from "@/shared/server";

import type { ReviewAction } from "../model/review-action";
import { ReviewActionForm } from "./review-action-form";

interface ReviewActionDialogProps {
  review: ReviewDetail;
  action: ReviewAction | null;
  fromReports: boolean;
  closeHref: string;
  hideHref: string;
}

// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다.
export function ReviewActionDialog({
  review,
  action,
  fromReports,
  closeHref,
  hideHref,
}: ReviewActionDialogProps) {
  const router = useRouter();
  const [shownAction, setShownAction] = useState(action);
  if (action && action !== shownAction) setShownAction(action);
  const close = () => router.replace(closeHref, { scroll: false });
  return (
    <Dialog.Root open={!isNull(action)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[600px]">
        {shownAction ? (
          <ReviewActionForm
            key={shownAction}
            review={review}
            action={shownAction}
            fromReports={fromReports}
            onDone={close}
            onSwitchToHide={() => router.replace(hideHref, { scroll: false })}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
