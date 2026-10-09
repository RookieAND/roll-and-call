import { Button, Dialog, Text } from "@roll-and-call/ui";

import { toKst } from "@/shared/lib";

import type { ManagedMember } from "../model/managed-member";

interface ApplicationNoteDialogProps {
  member: ManagedMember | null;
  onClose: () => void;
}

export function ApplicationNoteDialog({ member, onClose }: ApplicationNoteDialogProps) {
  return (
    <Dialog.Root open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Popup>
        {member && (
          <>
            <Dialog.Header>
              <Dialog.Title>{`${member.username}님의 신청글`}</Dialog.Title>
              <Text typography="body4" foreground="muted" numeric>
                {`${toKst(member.joinedAt).format("M월 D일 HH:mm")} 신청`}
              </Text>
            </Dialog.Header>
            <Dialog.Body className="max-h-[260px]">
              <Text typography="body3" className="whitespace-pre-wrap">
                {member.applicationNote}
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                colorPalette="gray"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                닫기
              </Button>
            </Dialog.Footer>
          </>
        )}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
