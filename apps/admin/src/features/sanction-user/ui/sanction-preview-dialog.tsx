import { AlertDialog, Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { useRef } from "react";

import { formatDateTime } from "@/shared/lib";
import type { StaffRole } from "@/shared/server";
import { OngoingChoiceList, UserPreview, type OngoingChoiceRow } from "@/shared/ui";

const ROLE_LABELS = { owner: "소유자", staff: "운영진" } as const;

interface SanctionPreviewDialogProps {
  open: boolean;
  nickname: string;
  days: number | null;
  end: string | null;
  userReason: string;
  staffMemo: string;
  rows: OngoingChoiceRow[];
  closedMemberCount: number;
  viewer: { nickname: string; role: StaffRole };
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export function SanctionPreviewDialog({
  open,
  nickname,
  days,
  end,
  userReason,
  staffMemo,
  rows,
  closedMemberCount,
  viewer,
  pending,
  onBack,
  onConfirm,
}: SanctionPreviewDialogProps) {
  const backRef = useRef<HTMLButtonElement>(null);

  const description = end
    ? `${days}일 동안, ${end}까지 모든 활동을 정지합니다`
    : "해제하기 전까지 모든 활동을 정지합니다";
  const restriction = end ? `${end}까지` : "해제될 때까지";
  const closedCount = rows.filter((row) => row.action === "close").length;
  const details = [
    ...(staffMemo.trim() ? [{ label: "운영진 메모", value: staffMemo.trim() }] : []),
    {
      label: "처리",
      value: `${viewer.nickname} (${ROLE_LABELS[viewer.role]}) · ${formatDateTime(new Date())}`,
    },
  ];

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onBack()}>
      <AlertDialog.Popup initialFocus={backRef} className="max-w-[620px]">
        <AlertDialog.Header>
          <AlertDialog.Title>{nickname} 제재 확정</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            <UserPreview>
              {restriction} 모든 활동(참가·대기 신청, 구인 개설)이 제한돼요. 사유:{" "}
              {userReason.trim()}. 이의가 있다면 디스코드 #문의 채널로 알려주세요.
            </UserPreview>
            {rows.length > 0 ? (
              <VStack gap="075">
                <Text typography="body4" weight="bold">
                  진행 중인 활동 처리
                </Text>
                <OngoingChoiceList rows={rows} readOnly />
                {closedCount > 0 ? (
                  <Text typography="body4" foreground="hint">
                    구인 {closedCount}건이 닫히고, 그 구인에 참여한 {closedMemberCount}명에게 운영진
                    조치로 닫혔다는 알림이 갑니다.
                  </Text>
                ) : null}
              </VStack>
            ) : null}
            <VStack render={<dl />} className="border-t border-(--rc-color-border-subtle) pt-125">
              {details.map((detail) => (
                <HStack key={detail.label} align="baseline" gap="125" className="py-075">
                  <Text
                    typography="body4"
                    foreground="hint"
                    render={<dt />}
                    className="w-[96px] shrink-0"
                  >
                    {detail.label}
                  </Text>
                  <Text typography="body3" weight="medium" render={<dd />} className="flex-1">
                    {detail.value}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <Text typography="body4" foreground="hint" className="mr-auto">
            확정하면 다른 운영진에게 디스코드 알림이 갑니다
          </Text>
          <Button
            ref={backRef}
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            onClick={onBack}
          >
            뒤로
          </Button>
          <Button colorPalette="danger" loading={pending} disabled={pending} onClick={onConfirm}>
            제재 확정
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
