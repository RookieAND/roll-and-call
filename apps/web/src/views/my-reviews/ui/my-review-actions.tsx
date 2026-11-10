"use client";

import { Badge, Button, HStack, IconButton } from "@roll-and-call/ui";
import { Clock, Trash2 } from "lucide-react";
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
  const editable = card.actions === MY_REVIEW_ACTIONS.editAndDelete;

  return (
    <>
      <HStack
        align="center"
        gap="050"
        className="mt-025 border-t border-gray-200 pt-100 desktop:mt-auto"
      >
        {editable ? (
          <Button
            render={<Link href={toServerPath(card.editHref)} />}
            variant="outline"
            size="md"
            className="min-w-0 flex-1"
          >
            내 후기 보기
          </Button>
        ) : (
          <>
            <Button
              render={<Link href={toServerPath(card.gameHref)} />}
              variant="outline"
              size="md"
              className="min-w-0 flex-1"
            >
              구인글 상세 보기
            </Button>
            <Button
              render={<Link href={toServerPath(card.reviewsHref)} />}
              variant="outline"
              size="md"
              className="min-w-0 flex-1"
            >
              세션 후기 보기
            </Button>
          </>
        )}
        {editable && card.caption && (
          <Badge colorPalette="primary" className="gap-050">
            <Clock size={12} aria-hidden />
            {card.caption}
          </Badge>
        )}
        {card.actions !== MY_REVIEW_ACTIONS.none && (
          <IconButton
            variant="outline"
            size="md"
            className="text-danger-600"
            aria-label="삭제하기"
            onClick={() => setDeleting(true)}
          >
            <Trash2 size={18} aria-hidden />
          </IconButton>
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
