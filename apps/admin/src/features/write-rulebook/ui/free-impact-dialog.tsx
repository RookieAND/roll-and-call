"use client";

import { objectParticle } from "@roll-and-call/database/notifications/model";
import { AlertDialog, Button, Text, VStack } from "@roll-and-call/ui";

import { ActionNetworkError, FactRows, ModalServerLabel, RetryableLabel } from "@/shared/ui";

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
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onClose()}>
      <AlertDialog.Popup className="max-w-[560px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>인증 정책을 인증 불필요로 바꿀까요?</AlertDialog.Title>
          <AlertDialog.Description>
            {`${rulebookLabel}${objectParticle(rulebookLabel)} 누구나 구인을 열 수 있는 룰북으로 바꿉니다.`}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body>
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <FactRows
              labelWidth={160}
              items={[{ label: "인증된 GM", value: `${certifiedCount}명` }]}
            />
            <Text typography="body3">{`심사 중 신청 ${pendingApplicationCount}건은 대기열에 남습니다.`}</Text>
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            뒤로
          </AlertDialog.Close>
          <Button loading={pending} onClick={onConfirm}>
            <RetryableLabel failed={networkError}>{"변경 확정"}</RetryableLabel>
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
