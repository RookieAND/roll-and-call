"use client";

import { Button, Callout, Dialog } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

interface OverlapNoticeDialogProps {
  overlapGameId: string | null;
  onClose: () => void;
}

const DESCRIPTION = "같은 시간에 참여하거나 신청 중인 다른 세션이 있어 신청할 수 없습니다.";
const GUIDE = "겹치는 세션을 확인한 뒤 다시 신청해 주세요.";

export function OverlapNoticeDialog({ overlapGameId, onClose }: OverlapNoticeDialogProps) {
  const router = useRouter();

  return (
    <Dialog.Root open={overlapGameId !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Popup className="break-keep">
        <Dialog.Header>
          <Dialog.Title>신청할 수 없습니다</Dialog.Title>
          <Dialog.Description>{DESCRIPTION}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Callout.Root colorPalette="primary" size="sm">
            <Callout.Icon />
            <Callout.Description>{GUIDE}</Callout.Description>
          </Callout.Root>
        </Dialog.Body>
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
