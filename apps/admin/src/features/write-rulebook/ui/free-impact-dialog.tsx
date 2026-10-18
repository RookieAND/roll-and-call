"use client";

import { objectParticle } from "@roll-and-call/app-kit/lib";
import { Button, Text, VStack } from "@roll-and-call/ui";

import {
  ActionNetworkError,
  FactRows,
  ModalServerLabel,
  RetryableLabel,
  MODAL_FOOTER_CLASS,
  ResponsiveDialog,
} from "@/shared/ui";

interface FreeImpactDialogProps {
  open: boolean;
  rulebookLabel: string;
  certifiedCount: number;
  pendingApplicationCount: number;
  pending: boolean;
  networkError: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

// 인증 필요 → 인증 불필요(R11). 심사 중 신청은 그대로 대기열에 남는다.
export function FreeImpactDialog({
  open,
  rulebookLabel,
  certifiedCount,
  pendingApplicationCount,
  pending,
  networkError,
  onConfirm,
  onClose,
}: FreeImpactDialogProps) {
  return (
    <ResponsiveDialog.Root
      alert
      open={open}
      onOpenChange={(nextOpen) => nextOpen || pending || onClose()}
    >
      <ResponsiveDialog.Popup className="max-w-[560px]">
        <ResponsiveDialog.Header>
          <ModalServerLabel />
          <ResponsiveDialog.Title>인증 정책을 인증 불필요로 바꿀까요?</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>
            {`${rulebookLabel}${objectParticle(rulebookLabel)} 누구나 구인을 열 수 있는 룰북으로 바꿉니다.`}
          </ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Body>
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <FactRows
              labelWidth={160}
              items={[{ label: "인증된 GM", value: `${certifiedCount}명` }]}
            />
            <Text typography="body3">{`심사 중 신청 ${pendingApplicationCount}건은 대기열에 남습니다.`}</Text>
          </VStack>
        </ResponsiveDialog.Body>
        <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <ResponsiveDialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            뒤로
          </ResponsiveDialog.Close>
          <Button loading={pending} onClick={onConfirm}>
            <RetryableLabel failed={networkError}>{"변경 확정"}</RetryableLabel>
          </Button>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
