"use client";

import { Button, Dialog } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { MODAL_FOOTER_CLASS, ModalServerLabel } from "@/shared/ui";

interface CancelledNoShowViewProps {
  summary: ReactNode;
  onRestore: () => void;
}

export function CancelledNoShowView({ summary, onRestore }: CancelledNoShowViewProps) {
  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>취소된 불참 기록</Dialog.Title>
        <Dialog.Description>이 기록은 불참 횟수에서 빠졌습니다.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>{summary}</Dialog.Body>
      <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <Dialog.Close render={<Button variant="outline" colorPalette="gray" />}>닫기</Dialog.Close>
        <Button variant="outline" colorPalette="gray" onClick={onRestore}>
          취소 되돌리기
        </Button>
      </Dialog.Footer>
    </>
  );
}
