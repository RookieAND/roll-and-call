"use client";

import {
  AlertDialog,
  Button,
  Field,
  HStack,
  Text,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { withObjectParticle } from "@/shared/lib";
import type { KickImpact } from "@/shared/server";
import {
  FactRows,
  FactSub,
  ManualNoticePreview,
  ModalServerLabel,
  useCurrentServer,
} from "@/shared/ui";

import { kickServerMember } from "../api/kick-server-member";
import { kickImpactLines } from "../model/kick-impact-lines";
import { kickNoticeText } from "../model/kick-notice-text";

interface KickMemberDialogProps {
  userId: string;
  nickname: string;
  discordHandle: string;
  impact: KickImpact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KickMemberDialog({
  userId,
  nickname,
  discordHandle,
  impact,
  open,
  onOpenChange,
}: KickMemberDialogProps) {
  const router = useRouter();
  const server = useCurrentServer();
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const canKick = Boolean(reason.trim()) && !pending;

  const kick = () =>
    startTransition(async () => {
      const result = await kickServerMember(userId, reason);
      if (result.ok && result.discordBanned) {
        toast.success(`${withObjectParticle(nickname)} ${server.name} 서버에서 추방했습니다`);
      }
      setReason("");
      onOpenChange(false);
      router.refresh();
    });

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup className="max-w-[600px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>{withObjectParticle(nickname)} 서버에서 추방할까요?</AlertDialog.Title>
          <AlertDialog.Description>
            디스코드에서 차단(ban)해 서버에서 내보냅니다.
            <br />
            서버에 남기고 활동만 막으려면 제재를 사용해 주세요.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="175">
            <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
              <FactRows
                labelWidth={72}
                items={[
                  {
                    label: "대상",
                    value: (
                      <>
                        {nickname}
                        <FactSub>{`@${discordHandle}`}</FactSub>
                      </>
                    ),
                  },
                  {
                    label: "영향",
                    value: (
                      <VStack gap="050" render={<ul />} className="my-075">
                        {kickImpactLines(impact).map((line) => (
                          <HStack key={line} gap="075" render={<li />}>
                            <Text typography="body3" foreground="hint" aria-hidden>
                              ·
                            </Text>
                            <Text typography="body3" weight="regular">
                              {line}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    ),
                  },
                ]}
              />
            </div>
            <Field.Root
              label="추방 사유"
              htmlFor="kick-reason"
              required
              description="활동 기록에 남습니다."
            >
              <Textarea
                id="kick-reason"
                rows={2}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
            <ManualNoticePreview
              text={kickNoticeText({ serverName: server.name, reason: reason.trim() })}
            />
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <AlertDialog.Close
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button colorPalette="danger" loading={pending} disabled={!canKick} onClick={kick}>
            추방 확정
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
