"use client";

import { Button, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { EyeOff, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  conflictToastText,
  quoteWithParticle,
  useActionSubmit,
  withObjectParticle,
} from "@/shared/lib";
import {
  ActionNetworkError,
  FactRows,
  ModalServerLabel,
  MODAL_FOOTER_CLASS,
  ResponsiveDialog,
} from "@/shared/ui";

import { submitRulebookHide } from "../api/submit-rulebook-hide";

interface HideRulebookDialogProps {
  open: boolean;
  rulebookId: string;
  rulebookLabel: string;
  certifiedCount: number;
  pendingApplicationCount: number;
  viewerId: string;
  onClose: () => void;
}

export function HideRulebookDialog({
  open,
  rulebookId,
  rulebookLabel,
  certifiedCount,
  pendingApplicationCount,
  viewerId,
  onClose,
}: HideRulebookDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(submitRulebookHide);
  const [reason, setReason] = useState("");
  const canHide = Boolean(reason.trim()) && !pending;

  const hide = async () => {
    const result = await submit(rulebookId, reason);
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`「${rulebookLabel}」 룰북을 숨겼습니다`);
    } else {
      const { conflict } = result;
      toast.info(
        conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "룰북" }),
      );
      router.refresh();
    }
    setReason("");
    onClose();
  };

  return (
    <ResponsiveDialog.Root
      alert
      open={open}
      onOpenChange={(nextOpen) => nextOpen || pending || onClose()}
    >
      <ResponsiveDialog.Popup className="max-w-[560px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>
            {`${quoteWithParticle(rulebookLabel, withObjectParticle)} 숨길까요?`}
          </ResponsiveDialog.Title>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <FactRows
              labelWidth={200}
              items={[
                { label: "인증된 GM", value: `${certifiedCount}명` },
                { label: "함께 반려되는 심사 중 신청", value: `${pendingApplicationCount}건` },
              ]}
            />
            <Field.Root label="사유" htmlFor="hide-rulebook-reason" required>
              <Textarea
                id="hide-rulebook-reason"
                rows={2}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
          </VStack>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </ResponsiveDialog.Close>
          <Button
            colorPalette="danger"
            loading={pending}
            disabled={!canHide}
            onClick={() => void hide()}
          >
            {networkError ? <RotateCcw size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}
            {networkError ? "다시 시도" : "숨기기"}
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
