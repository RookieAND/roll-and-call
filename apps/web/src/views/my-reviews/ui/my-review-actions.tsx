"use client";

import { Button, HStack } from "@roll-and-call/ui";
import Link from "next/link";
import { useState } from "react";

import { DeleteReviewDialog } from "@/features/delete-review";
import { useServerPath } from "@/shared/lib";

import { MY_REVIEW_ACTIONS, type MyReviewCardModel } from "../model/my-review-card";

interface MyReviewActionsProps {
  card: MyReviewCardModel;
}

export function MyReviewActions({ card }: MyReviewActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const toServerPath = useServerPath();
  if (card.actions === MY_REVIEW_ACTIONS.none) return null;

  return (
    <>
      <HStack gap="100" className="[&>*]:flex-1">
        <Button variant="outline" size="lg" onClick={() => setDeleting(true)}>
          삭제하기
        </Button>
        {card.actions === MY_REVIEW_ACTIONS.editAndDelete && (
          <Button variant="tinted" size="lg" render={<Link href={toServerPath(card.editHref)} />}>
            수정하기
          </Button>
        )}
      </HStack>
      <DeleteReviewDialog
        reviewId={card.id}
        subject={card.subject}
        open={deleting}
        onOpenChange={setDeleting}
      />
    </>
  );
}
