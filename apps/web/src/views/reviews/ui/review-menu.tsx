"use client";

import { IconButton, Sheet } from "@roll-and-call/ui";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

import { DeleteReviewDialog } from "@/features/delete-review";
import { ServerLink } from "@/shared/ui";

interface ReviewMenuProps {
  reviewId: string;
  editPath: string | null;
  deleteSubject: string;
}

export function ReviewMenu({ reviewId, editPath, deleteSubject }: ReviewMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openDelete() {
    setMenuOpen(false);
    setDeleting(true);
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
            {editPath && <Sheet.Item render={<ServerLink path={editPath} />}>수정하기</Sheet.Item>}
            <Sheet.Item onClick={openDelete} className="text-danger-600">
              삭제하기
            </Sheet.Item>
          </Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
      <DeleteReviewDialog
        reviewId={reviewId}
        subject={deleteSubject}
        open={deleting}
        onOpenChange={setDeleting}
      />
    </>
  );
}
