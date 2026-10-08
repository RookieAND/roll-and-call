"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { NoShowDetail } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { cancelNoShowRecord } from "../api/cancel-no-show-record";
import { restoreNoShowRecord } from "../api/restore-no-show-record";
import { CancelledNoShowView } from "./cancelled-no-show-view";
import { NO_SHOW_REASON_FIELD_ID, NoShowReasonForm } from "./no-show-reason-form";

interface CancelNoShowDialogProps {
  record: NoShowDetail | null;
  summary: ReactNode;
  closeHref: string;
}

// 유효 기록이면 불참 취소, 취소된 기록이면 안내 창에서 [취소 되돌리기]를 눌러 되돌리기 창으로 넘어간다.
export function CancelNoShowDialog({ record, summary, closeHref }: CancelNoShowDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const restoring = !isNull(record) && restoringId === record.id;
  const close = () => router.replace(toServerPath(closeHref), { scroll: false });

  return (
    <Dialog.Root open={!isNull(record)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup
        size="lg"
        className="max-w-[600px]"
        initialFocus={() => document.getElementById(NO_SHOW_REASON_FIELD_ID)}
      >
        {record?.cancellation && !restoring ? (
          <CancelledNoShowView
            key={`${record.id}-cancelled`}
            summary={summary}
            onRestore={() => setRestoringId(record.id)}
          />
        ) : null}
        {record?.cancellation && restoring ? (
          <NoShowReasonForm
            key={`${record.id}-restore`}
            copy={{
              title: "불참 취소 되돌리기",
              description: "이 기록이 불참 횟수에 다시 포함됩니다.",
              reasonLabel: "사유",
              placeholder: "예: 당사자가 사정을 잘못 전한 것을 확인했습니다.",
              confirmLabel: "되돌리기 확정",
              successMessage: `불참 취소를 되돌렸습니다 · ${record.nickname}`,
            }}
            summary={summary}
            notification={{
              kind: NOTIFICATION_KIND.absenceRestored,
              params: { gameId: record.gameId, gameTitle: record.sessionTitle },
            }}
            submit={(reason) => restoreNoShowRecord({ noShowId: record.id, reason })}
            onClose={close}
          />
        ) : null}
        {record && !record.cancellation ? (
          <NoShowReasonForm
            key={`${record.id}-cancel`}
            copy={{
              title: "불참 취소",
              description: "사정을 확인한 뒤 기록을 취소합니다",
              reasonLabel: "사유",
              placeholder: "예: 전날 디스코드로 GM에게 불참을 알린 메시지를 확인했습니다.",
              confirmLabel: "불참 취소",
              successMessage: `불참을 취소했습니다 · ${record.nickname}`,
            }}
            summary={summary}
            notification={{
              kind: NOTIFICATION_KIND.absenceCancelled,
              params: { gameId: record.gameId, gameTitle: record.sessionTitle },
            }}
            submit={(reason) => cancelNoShowRecord({ noShowId: record.id, reason })}
            onClose={close}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
