"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Dialog, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";
import type { NoShowDetail } from "@/shared/server";
import { ItemCard, useServerPath } from "@/shared/ui";

import { cancelNoShowRecord } from "../api/cancel-no-show-record";
import { restoreNoShowRecord } from "../api/restore-no-show-record";
import { NO_SHOW_REASON_FIELD_ID, NoShowReasonForm } from "./no-show-reason-form";

interface CancelNoShowDialogProps {
  record: NoShowDetail | null;
  summary: ReactNode;
  closeHref: string;
}

// 유효 기록이면 불참 취소, 취소된 기록이면 취소 되돌리기 창이다.
export function CancelNoShowDialog({ record, summary, closeHref }: CancelNoShowDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const close = () => router.replace(toServerPath(closeHref), { scroll: false });

  return (
    <Dialog.Root open={!isNull(record)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup
        size="lg"
        className="max-w-[600px]"
        initialFocus={() => document.getElementById(NO_SHOW_REASON_FIELD_ID)}
      >
        {record?.cancellation ? (
          <NoShowReasonForm
            key={`${record.id}-restore`}
            copy={{
              title: "취소된 불참 기록",
              description: "이 기록은 불참 횟수에서 빠졌습니다.",
              reasonLabel: "되돌리는 사유",
              placeholder: "예: 당사자가 사정을 잘못 전한 것을 확인했습니다.",
              confirmLabel: "취소 되돌리기",
              successMessage: `불참 취소를 되돌렸습니다 · ${record.nickname}`,
            }}
            summary={
              <VStack gap="150">
                {summary}
                <ItemCard icon={X} tone="danger" title="취소 사유">
                  {record.cancellation.reason}
                </ItemCard>
                <ItemCard
                  icon={ShieldCheck}
                  title="처리한 운영진"
                  meta={`${record.cancellation.by} · ${formatDateTime(record.cancellation.at)}`}
                />
              </VStack>
            }
            notification={{
              kind: NOTIFICATION_KIND.absenceRestored,
              params: { gameId: record.gameId, gameTitle: record.sessionTitle },
            }}
            submit={(reason) => restoreNoShowRecord(record.id, reason)}
            onClose={close}
          />
        ) : null}
        {record && !record.cancellation ? (
          <NoShowReasonForm
            key={`${record.id}-cancel`}
            copy={{
              title: "불참 취소",
              description: "사정을 확인했다면 사유를 적어 기록을 취소합니다.",
              reasonLabel: "취소 사유",
              placeholder: "예: 전날 디스코드로 GM에게 불참을 알린 메시지를 확인했습니다.",
              confirmLabel: "불참 취소",
              successMessage: `불참을 취소했습니다 · ${record.nickname}`,
            }}
            summary={summary}
            notification={{
              kind: NOTIFICATION_KIND.absenceCancelled,
              params: { gameId: record.gameId, gameTitle: record.sessionTitle },
            }}
            submit={(reason) => cancelNoShowRecord(record.id, reason)}
            onClose={close}
          />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
