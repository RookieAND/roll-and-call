"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { useRef } from "react";

import { quoteWithParticle, withObjectParticle } from "@/shared/lib";
import { MODAL_FOOTER_CLASS, ModalServerLabel, ResponsiveDialog } from "@/shared/ui";

import type { useHomebrewDecision } from "./use-homebrew-decision";

interface ApproveHomebrewDialogProps {
  decision: ReturnType<typeof useHomebrewDecision>;
  name: string;
}

// 승인하면 룰북이 새로 생기므로 확인을 받는다. 사용 범위는 늘 제작자만 사용으로 시작한다.
export function ApproveHomebrewDialog({ decision, name }: ApproveHomebrewDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const pending = decision.approving;
  return (
    <ResponsiveDialog.Root
      alert
      open={decision.approveOpen}
      onOpenChange={(open) => open || pending || decision.closeApprove()}
    >
      <ResponsiveDialog.Popup initialFocus={cancelRef} className="max-w-[440px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>
            {`${quoteWithParticle(name, withObjectParticle)} 승인할까요?`}
          </ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            처음에는 제작자만 이 룰로 구인을 열 수 있습니다.
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        {decision.approveFailed ? (
          <ResponsiveDialog.Body>
            <Callout.Root colorPalette="danger">
              <Callout.Icon />
              <Callout.Title>승인하지 못했습니다.</Callout.Title>
              <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
            </Callout.Root>
          </ResponsiveDialog.Body>
        ) : null}
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <Button
            ref={cancelRef}
            variant="outline"
            colorPalette="gray"
            disabled={pending}
            onClick={decision.closeApprove}
          >
            취소
          </Button>
          <Button
            colorPalette="success"
            size="lg"
            loading={pending}
            onClick={() => void decision.approve()}
          >
            승인하기
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
