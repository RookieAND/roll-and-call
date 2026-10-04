"use client";

import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";
import { LinkRequestForm } from "./link-request-form";
import { RejectRequestForm } from "./reject-request-form";

interface RequestDialogProps {
  opened: { action: Exclude<RequestAction, "add">; request: RulebookRequestRow } | null;
  rulebooks: RulebookRow[];
  closeHref: string;
  viewerId: string;
}

// 닫히는 동안에도 내용이 남도록 마지막으로 연 창을 기억한다.
export function RequestDialog({ opened, rulebooks, closeHref, viewerId }: RequestDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [shown, setShown] = useState(opened);
  const openedKey = opened ? `${opened.action}-${opened.request.id}` : null;
  const formKey = shown ? `${shown.action}-${shown.request.id}` : null;
  if (opened && openedKey !== formKey) setShown(opened);
  const close = () => router.replace(toServerPath(closeHref), { scroll: false });
  return (
    <Dialog.Root open={!isNull(opened)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[560px]">
        {shown?.action === REQUEST_ACTION.link ? (
          <LinkRequestForm
            key={formKey ?? undefined}
            request={shown.request}
            rulebooks={rulebooks}
            viewerId={viewerId}
            onDone={close}
          />
        ) : null}
        {shown?.action === REQUEST_ACTION.reject ? (
          <RejectRequestForm
            key={formKey ?? undefined}
            request={shown.request}
            viewerId={viewerId}
            onDone={close}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
