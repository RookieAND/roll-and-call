"use client";

import { Button } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { MODAL_FOOTER_CLASS, ModalServerLabel, ResponsiveDialog } from "@/shared/ui";

interface CancelledNoShowViewProps {
  summary: ReactNode;
  onRestore: () => void;
}

export function CancelledNoShowView({ summary, onRestore }: CancelledNoShowViewProps) {
  return (
    <>
      <ResponsiveDialog.Header>
        <ModalServerLabel />
        <ResponsiveDialog.Title>취소된 불참 기록</ResponsiveDialog.Title>
        <ResponsiveDialog.Description>
          이 기록은 불참 횟수에서 빠졌습니다.
        </ResponsiveDialog.Description>
      </ResponsiveDialog.Header>
      <ResponsiveDialog.Body>{summary}</ResponsiveDialog.Body>
      <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <ResponsiveDialog.Close render={<Button variant="outline" colorPalette="gray" />}>
          닫기
        </ResponsiveDialog.Close>
        <Button variant="outline" colorPalette="gray" onClick={onRestore}>
          취소 되돌리기
        </Button>
      </ResponsiveDialog.Footer>
    </>
  );
}
