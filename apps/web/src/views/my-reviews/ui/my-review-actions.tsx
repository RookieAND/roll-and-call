"use client";

import { Badge, HStack, IconButton } from "@roll-and-call/ui";
import { Clock, Pencil, Trash2 } from "lucide-react";
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
      <HStack align="center" gap="050" className="mt-025 border-t border-gray-200 pt-100">
        {card.caption && (
          <Badge colorPalette="primary" className="gap-050">
            <Clock size={12} aria-hidden />
            {card.caption}
          </Badge>
        )}
        <span className="flex-1" />
        {card.actions === MY_REVIEW_ACTIONS.editAndDelete && (
          <IconButton
            variant="outline"
            size="md"
            aria-label="수정하기"
            render={<Link href={toServerPath(card.editHref)} />}
          >
            <Pencil size={18} aria-hidden />
          </IconButton>
        )}
        <IconButton
          variant="outline"
          size="md"
          className="text-danger-600"
          aria-label="삭제하기"
          onClick={() => setDeleting(true)}
        >
          <Trash2 size={18} aria-hidden />
        </IconButton>
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
