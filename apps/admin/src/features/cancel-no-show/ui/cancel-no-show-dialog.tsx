"use client";

import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { NoShowDetail } from "@/shared/server";

import { NoShowDialogContent } from "./no-show-dialog-content";

interface CancelNoShowDialogProps {
  record: NoShowDetail | null;
  summary: ReactNode;
  closeHref: string;
  nextRecordHref: string | null;
}

// 다른 운영진과 부딪힌 기록은 새로 받은 상태 대신 충돌 안내를 계속 보여 준다.
export function CancelNoShowDialog({
  record,
  summary,
  closeHref,
  nextRecordHref,
}: CancelNoShowDialogProps) {
  const router = useRouter();
  const [conflict, setConflict] = useState<{
    recordId: string;
    detail: NonNullable<NoShowDetail["cancellation"]>;
  } | null>(null);
  const close = () => router.replace(closeHref, { scroll: false });
  const recordConflict = record && conflict?.recordId === record.id ? conflict.detail : null;

  return (
    <Dialog.Root open={!isNull(record)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup
        size="lg"
        className="max-w-[600px]"
        initialFocus={() => document.getElementById("no-show-cancel-reason")}
      >
        {record ? (
          <NoShowDialogContent
            record={record}
            summary={summary}
            conflict={recordConflict}
            nextRecordHref={nextRecordHref}
            onConflict={(detail) => setConflict({ recordId: record.id, detail })}
            onDone={close}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
