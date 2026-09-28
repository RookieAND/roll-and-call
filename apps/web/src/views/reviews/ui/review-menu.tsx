"use client";

import { IconButton, Sheet } from "@roll-and-call/ui";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DeleteReviewDialog } from "@/features/delete-review";
import { ReportReviewSheet } from "@/features/report-review";

interface ReviewMenuProps {
  reviewId: string;
  own: boolean;
  // 본인 후기를 아직 고칠 수 있을 때만 수정하기를 둔다.
  editHref: string | null;
  deleteSubject: string;
  reportSubject: string;
}

// 본인에게는 수정·삭제, 다른 사람에게는 신고만 보인다.
export function ReviewMenu({
  reviewId,
  own,
  editHref,
  deleteSubject,
  reportSubject,
}: ReviewMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reporting, setReporting] = useState(false);

  function openAfterMenu(open: (value: boolean) => void) {
    setMenuOpen(false);
    open(true);
  }

  return (
    <>
      <Sheet.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Sheet.Trigger
          render={<IconButton variant="ghost" aria-label="더보기" className="-mt-100 -mr-100" />}
        >
          <EllipsisVertical size={18} />
        </Sheet.Trigger>
        <Sheet.Overlay />
        <Sheet.Popup aria-label="후기 메뉴">
          <Sheet.Handle />
          <Sheet.Body>
            {own && editHref && <Sheet.Item render={<Link href={editHref} />}>수정하기</Sheet.Item>}
            {own && (
              <Sheet.Item onClick={() => openAfterMenu(setDeleting)} className="text-danger-600">
                삭제하기
              </Sheet.Item>
            )}
            {!own && (
              <Sheet.Item onClick={() => openAfterMenu(setReporting)} className="text-danger-600">
                신고하기
              </Sheet.Item>
            )}
          </Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
      {own ? (
        <DeleteReviewDialog
          reviewId={reviewId}
          subject={deleteSubject}
          open={deleting}
          onOpenChange={setDeleting}
        />
      ) : (
        <ReportReviewSheet
          reviewId={reviewId}
          subject={reportSubject}
          open={reporting}
          onOpenChange={setReporting}
        />
      )}
    </>
  );
}
