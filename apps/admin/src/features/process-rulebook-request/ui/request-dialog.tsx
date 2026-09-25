"use client";

import { Dialog } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { RulebookRequestRow, RulebookRow } from "@/shared/server";

import { REQUEST_ACTION, type RequestAction } from "../model/request-action";
import { LinkRequestForm } from "./link-request-form";
import { RejectRequestForm } from "./reject-request-form";

interface RequestDialogProps {
  opened: { action: Exclude<RequestAction, "add">; request: RulebookRequestRow } | null;
  rulebooks: RulebookRow[];
  closeHref: string;
}

// 주소의 ?action=link|reject&request= 로 연다. 이미 처리된 요청이면 화면이 null로 넘긴다.
// 닫히는 동안에도 내용이 남도록 마지막으로 연 창을 기억한다.
export function RequestDialog({ opened, rulebooks, closeHref }: RequestDialogProps) {
  const router = useRouter();
  const [shown, setShown] = useState(opened);
  const openedKey = opened ? `${opened.action}-${opened.request.id}` : null;
  const formKey = shown ? `${shown.action}-${shown.request.id}` : null;
  if (opened && openedKey !== formKey) setShown(opened);
  const close = () => router.replace(closeHref, { scroll: false });
  return (
    <Dialog.Root open={opened !== null} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[560px]">
        {shown?.action === REQUEST_ACTION.link ? (
          <LinkRequestForm
            key={formKey ?? undefined}
            request={shown.request}
            rulebooks={rulebooks}
            onDone={close}
          />
        ) : null}
        {shown?.action === REQUEST_ACTION.reject ? (
          <RejectRequestForm key={formKey ?? undefined} request={shown.request} onDone={close} />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
