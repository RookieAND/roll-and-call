"use client";

import { Dialog } from "@roll-and-call/ui";
import { useState } from "react";

import type { RulebookRequestRow, RulebookRow } from "@/shared/server";

import { ApproveRequestForm } from "./approve-request-form";

interface ApproveRequestDialogProps {
  request: RulebookRequestRow | null;
  rulebooks: RulebookRow[];
  onClose: () => void;
}

// 닫히는 동안에도 내용이 남도록 마지막으로 연 요청을 기억한다.
export function ApproveRequestDialog({ request, rulebooks, onClose }: ApproveRequestDialogProps) {
  const [shown, setShown] = useState(request);
  if (request && request.id !== shown?.id) setShown(request);
  return (
    <Dialog.Root open={request !== null} onOpenChange={(open) => open || onClose()}>
      <Dialog.Popup size="lg" className="max-w-[640px]">
        {shown ? (
          <ApproveRequestForm
            key={shown.id}
            request={shown}
            rulebooks={rulebooks}
            onDone={onClose}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
