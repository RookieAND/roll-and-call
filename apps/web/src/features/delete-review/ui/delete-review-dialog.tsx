"use client";

import { Callout } from "@roll-and-call/ui";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { deleteReview } from "../api/delete-review";

interface DeleteReviewDialogProps {
  reviewId: string;
  subject: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteReviewDialog({
  reviewId,
  subject,
  open,
  onOpenChange,
}: DeleteReviewDialogProps) {
  const { pending, run } = useAction();

  function remove() {
    run(() => deleteReview(reviewId), {
      onSuccess: () => {
        toast.success("후기를 삭제했습니다");
        onOpenChange(false);
      },
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="후기를 삭제할까요?"
      description={subject}
      cancelLabel="그만두기"
      confirmLabel="삭제하기"
      danger
      pending={pending}
      onConfirm={remove}
    >
      <Callout.Root colorPalette="danger" className="break-keep">
        <Callout.Description>
          같은 세션에 다시 쓸 수 없습니다.
          <br />
          올린 사진도 함께 지워집니다.
        </Callout.Description>
      </Callout.Root>
    </ConfirmDialog>
  );
}
