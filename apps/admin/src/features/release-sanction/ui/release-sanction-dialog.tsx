"use client";

import { Button, Dialog, Field, HStack, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";
import type { Sanction } from "@/shared/server";
import { UserPreview } from "@/shared/ui";

import { releaseUserSanction } from "../api/release-user-sanction";

const DAY = 86_400_000;

interface ReleaseSanctionDialogProps {
  userId: string;
  nickname: string;
  sanction: Sanction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReleaseSanctionDialog({
  userId,
  nickname,
  sanction,
  open,
  onOpenChange,
}: ReleaseSanctionDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const until = sanction.until ? formatDate(sanction.until) : null;
  const description = until
    ? `${until}까지 남은 제재를 지금 해제합니다`
    : "무기한 제재를 지금 해제합니다";
  const remaining = sanction.until
    ? `${Math.max(1, Math.ceil((sanction.until.getTime() - Date.now()) / DAY))}일`
    : "무기한";
  const stats = [
    { label: "남은 기간", value: remaining, sub: until ? `${until}까지` : null },
    { label: "해제한 시점부터", value: "활동 가능", sub: "참가·대기 신청 · 구인 개설" },
  ];
  const canRelease = Boolean(userReason.trim()) && !pending;

  const release = () =>
    startTransition(async () => {
      const result = await releaseUserSanction(userId, { userReason, staffMemo });
      if (result.ok) toast.success(`${nickname}님의 제재를 해제했습니다`);
      else {
        toast.info("이미 해제된 제재입니다");
        router.refresh();
      }
      setUserReason("");
      setStaffMemo("");
      onOpenChange(false);
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[540px]">
        <Dialog.Header>
          <Dialog.Title>{nickname} 제재 해제</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <VStack render={<dl />}>
              {stats.map((stat) => (
                <HStack
                  key={stat.label}
                  align="baseline"
                  gap="150"
                  className="border-t border-(--rc-color-border-subtle) py-100"
                >
                  <VStack gap="025" className="min-w-0 flex-1">
                    <Text typography="body4" foreground="muted" render={<dt />}>
                      {stat.label}
                    </Text>
                    {stat.sub ? (
                      <Text typography="body4" foreground="hint">
                        {stat.sub}
                      </Text>
                    ) : null}
                  </VStack>
                  <Text typography="subtitle2" numeric render={<dd />}>
                    {stat.value}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <Field.Root
              label="해제 사유 (사용자에게 보임)"
              htmlFor="release-user-reason"
              required
              description="입력한 사유는 사용자 화면에서 ‘사유:’ 뒤에 그대로 표시됩니다."
            >
              <Textarea
                id="release-user-reason"
                rows={2}
                value={userReason}
                onChange={(event) => setUserReason(event.target.value)}
              />
            </Field.Root>
            <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="release-staff-memo">
              <Textarea
                id="release-staff-memo"
                rows={1}
                placeholder="선택"
                value={staffMemo}
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
            <UserPreview>
              제재가 해제됐어요. 사유: {userReason.trim()}. 이제 모든 활동(참가·대기 신청, 구인
              개설)을 다시 할 수 있어요.
            </UserPreview>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canRelease} onClick={release}>
            해제 확정
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
