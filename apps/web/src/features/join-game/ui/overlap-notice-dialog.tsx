"use client";

import { Button, Dialog } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { LineBreaks } from "@/shared/ui";

interface OverlapNoticeDialogProps {
  overlapGameId: string | null;
  onClose: () => void;
}

const BODY_LINES = [
  "같은 시간에 참여하거나 신청 중인 다른 세션이 있어 신청할 수 없습니다.",
  "겹치는 세션을 확인한 뒤 다시 신청해 주세요.",
] as const;

// 서버 없는 구인 주소는 그 구인의 서버로 보내 주므로, 다른 서버의 세션도 id만으로 간다.
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
