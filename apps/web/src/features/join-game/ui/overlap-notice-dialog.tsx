"use client";

import { Button, Dialog } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { LineBreaks } from "@/shared/ui";

interface OverlapNoticeDialogProps {
  overlapGameId: string | null;
  onClose: () => void;
}

const BODY_LINES = [
  "시간이 겹치는 다른 세션이 있어 신청할 수 없습니다.",
  "겹치는 세션을 확인한 뒤 다시 신청해 주세요.",
] as const;

export function OverlapNoticeDialog({ overlapGameId, onClose }: OverlapNoticeDialogProps) {
  const router = useRouter();

  return (
    <Dialog.Root open={overlapGameId !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>신청할 수 없습니다</Dialog.Title>
          <Dialog.Description>
            <LineBreaks lines={BODY_LINES} />
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer layout="row">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            닫기
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => router.push(`/games/${overlapGameId}`)}
          >
            겹치는 세션 보기
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
