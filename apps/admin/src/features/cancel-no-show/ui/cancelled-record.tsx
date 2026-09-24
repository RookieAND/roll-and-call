import { Button, Dialog, VStack } from "@roll-and-call/ui";
import { ScrollText, ShieldCheck, X } from "lucide-react";
import type { ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";
import type { NoShowDetail } from "@/shared/server";
import { ItemCard } from "@/shared/ui";

import { FooterNote } from "./footer-note";

interface CancelledRecordProps {
  gmNickname: string;
  cancellation: NonNullable<NoShowDetail["cancellation"]>;
  summary: ReactNode;
}

export function CancelledRecord({ gmNickname, cancellation, summary }: CancelledRecordProps) {
  const cancelledAt = formatDateTime(cancellation.at);
  return (
    <>
      <Dialog.Header>
        <Dialog.Title>취소된 불참 기록</Dialog.Title>
        <Dialog.Description>{cancelledAt}에 취소됨</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {summary}
          <ItemCard icon={X} tone="danger" title="취소 사유">
            {cancellation.reason}
          </ItemCard>
          <ItemCard
            icon={ShieldCheck}
            title="처리한 운영진"
            meta={`${cancellation.by} · ${cancelledAt}`}
          >
            당사자와 {gmNickname}에게 알림이 전달됐습니다.
          </ItemCard>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <FooterNote icon={ScrollText}>활동 기록에도 남아 있습니다</FooterNote>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />}>닫기</Dialog.Close>
      </Dialog.Footer>
    </>
  );
}
