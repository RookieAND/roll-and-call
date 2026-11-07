import { Button, Dialog, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { toKst } from "@/shared/lib";
import { LARGE_DIALOG_TITLE_CLASS } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";

interface ApplicationNoteDialogProps {
  member: ManagedMember | null;
  question: string | null;
  onClose: () => void;
}

export function ApplicationNoteDialog({ member, question, onClose }: ApplicationNoteDialogProps) {
  return (
    <Dialog.Root open={!isNull(member)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Popup>
        {member && (
          <>
            <Dialog.Header>
              <Dialog.Title
                className={LARGE_DIALOG_TITLE_CLASS}
              >{`${member.username}님의 신청글`}</Dialog.Title>
              <Text typography="body4" foreground="muted" numeric>
                {`${toKst(member.joinedAt).format("M월 D일 HH:mm")} 신청`}
              </Text>
            </Dialog.Header>
            {question && (
              <VStack gap="050">
                <Text typography="body4" foreground="muted" weight="bold">
                  GM의 질문
                </Text>
                <Text typography="body4" foreground="muted" className="break-keep">
                  {question}
                </Text>
              </VStack>
            )}
            <Dialog.Body className="mt-250 max-h-[260px] rounded-500 border border-gray-200 bg-gray-50 px-150 py-125">
              <Text typography="body2" className="whitespace-pre-wrap">
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
