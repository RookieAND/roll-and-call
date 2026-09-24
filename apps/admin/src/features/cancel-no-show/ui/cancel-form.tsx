"use client";

import { Button, Dialog, Field, Textarea, VStack, cn, toast } from "@roll-and-call/ui";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";
import type { NoShowDetail } from "@/shared/server";
import { ConflictNotice } from "@/shared/ui";

import { cancelNoShowRecord } from "../api/cancel-no-show-record";
import { FooterNote } from "./footer-note";

interface CancelFormProps {
  record: NoShowDetail;
  summary: ReactNode;
  conflict: NonNullable<NoShowDetail["cancellation"]> | null;
  nextRecordHref: string | null;
  onConflict: (conflict: NonNullable<NoShowDetail["cancellation"]>) => void;
  onDone: () => void;
}

export function CancelForm({
  record,
  summary,
  conflict,
  nextRecordHref,
  onConflict,
  onDone,
}: CancelFormProps) {
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const canCancel = Boolean(reason.trim()) && !pending && !conflict;

  const cancel = () =>
    startTransition(async () => {
      const result = await cancelNoShowRecord(record.id, reason);
      if (!result.ok) {
        onConflict(result.conflict);
        return;
      }
      toast.success(`불참을 취소했습니다 · ${record.nickname}`);
      onDone();
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>불참 취소</Dialog.Title>
        <Dialog.Description>디스코드 DM으로 사정을 들은 뒤 기록을 취소합니다</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflict ? (
            <ConflictNotice
              title={`다른 운영진(${conflict.by})이 이미 이 불참을 취소했습니다`}
              description={`${formatDateTime(conflict.at)} · 사유: ${conflict.reason.replace(/\.$/, "")}. 입력한 내용은 저장되지 않았습니다.`}
              actions={
                nextRecordHref ? (
                  <Button size="sm" render={<Link href={nextRecordHref} scroll={false} />}>
                    다음 기록
                  </Button>
                ) : null
              }
            />
          ) : null}
          <VStack gap="150" className={cn(conflict && "pointer-events-none opacity-50")}>
            {summary}
            <Field.Root
              label="사유"
              htmlFor="no-show-cancel-reason"
              required
              description="당사자와 GM에게 가는 알림에 그대로 들어갑니다."
            >
              <Textarea
                id="no-show-cancel-reason"
                rows={2}
                value={reason}
                disabled={Boolean(conflict)}
                placeholder="예: 전날 디스코드로 GM에게 불참을 알린 메시지를 확인했습니다."
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <FooterNote icon={Bell}>당사자와 처리한 GM에게 알림이 갑니다</FooterNote>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          닫기
        </Dialog.Close>
        <Button
          variant="outline"
          colorPalette="danger"
          disabled={!canCancel}
          loading={pending}
          onClick={cancel}
        >
          불참 취소
        </Button>
      </Dialog.Footer>
    </>
  );
}
