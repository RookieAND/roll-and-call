"use client";

import { AlertDialog, Button } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";

import { MY_REVIEWS_HREF, REVIEW_BLOCK_DIALOG, type ReviewBlock } from "../model/review-block";

interface ReviewBlockedDialogProps {
  block: ReviewBlock | null;
  fallbackHref: string;
}

export function ReviewBlockedDialog({ block, fallbackHref }: ReviewBlockedDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const dialog = block ? REVIEW_BLOCK_DIALOG[block] : null;
  const href = dialog?.toMyReviews ? toServerPath(MY_REVIEWS_HREF) : fallbackHref;

  return (
    <AlertDialog.Root open={!isNull(dialog)} onOpenChange={(open) => !open && router.push(href)}>
      <AlertDialog.Popup className="break-keep">
        <AlertDialog.Header>
          <AlertDialog.Title>{dialog?.title}</AlertDialog.Title>
          <AlertDialog.Description>{dialog?.description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer layout="row">
          <Button size="lg" className="flex-1" onClick={() => router.push(href)}>
            {dialog?.confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
