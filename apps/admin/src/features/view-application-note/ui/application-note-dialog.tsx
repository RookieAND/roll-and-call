"use client";

import { Button, Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { MODAL_FOOTER_CLASS, ModalServerLabel, useServerPath } from "@/shared/ui";

import { ApplicationNoteBody } from "./application-note-body";

interface ApplicationNoteDialogProps {
  gameId: string;
  nicknames: Record<string, string>;
  closeHref: string;
}

// 주소의 note=userId로 연다. 닫히는 동안에도 내용이 남도록 마지막으로 연 사람을 기억한다.
export function ApplicationNoteDialog({
  gameId,
  nicknames,
  closeHref,
}: ApplicationNoteDialogProps) {
  const toServerPath = useServerPath();
  const noteParam = useSearchParams().get("note");
  const userId = noteParam && noteParam in nicknames ? noteParam : null;
  const [shownUserId, setShownUserId] = useState(userId);
  if (userId && userId !== shownUserId) setShownUserId(userId);
  const close = () => window.history.replaceState(null, "", toServerPath(closeHref));

  return (
    <Dialog.Root open={!isNull(userId)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[480px]">
        {shownUserId && (
          <>
            <Dialog.Header>
              <ModalServerLabel />
              <Dialog.Title className="truncate">{`${nicknames[shownUserId]}님의 신청글`}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <ApplicationNoteBody key={shownUserId} gameId={gameId} userId={shownUserId} />
            </Dialog.Body>
            <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
              <Dialog.Close render={<Button variant="outline" colorPalette="gray" />}>
                닫기
              </Dialog.Close>
            </Dialog.Footer>
          </>
        )}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
