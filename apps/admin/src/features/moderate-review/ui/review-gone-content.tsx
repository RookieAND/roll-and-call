import { Button, Dialog } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import { ItemCard, ModalServerLabel, ServerLink } from "@/shared/ui";

interface ReviewGoneContentProps {
  deleted: { author: string; at: Date } | null;
  nextHref: string | undefined;
  onClose: () => void;
}

// 작성자가 지운 후기. 확정 버튼 없이 [닫기](들어온 목록을 새로 읽는다)와 [다음 건]만 둔다.
export function ReviewGoneContent({ deleted, nextHref, onClose }: ReviewGoneContentProps) {
  const meta = deleted ? `${deleted.author} · ${formatDateTime(deleted.at)} 삭제` : undefined;
  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>후기를 찾을 수 없습니다</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <ItemCard icon={X} title="작성자가 삭제한 후기입니다." meta={meta} />
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Button variant="ghost" colorPalette="gray" onClick={onClose}>
          닫기
        </Button>
        <Button disabled={!nextHref} render={nextHref ? <ServerLink path={nextHref} /> : undefined}>
          다음 건
        </Button>
      </Dialog.Footer>
    </>
  );
}
