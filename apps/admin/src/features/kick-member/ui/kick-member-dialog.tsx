"use client";

import { reasonLabel, USER_ACTION_REASON } from "@roll-and-call/database/moderation/model";
import { AlertDialog, Button, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { conflictToastText, draftReason, useActionSubmit, withObjectParticle } from "@/shared/lib";
import type { KickImpact } from "@/shared/server";
import {
  ActionNetworkError,
  FactRows,
  FactSub,
  ManualNoticePreview,
  ModalServerLabel,
  ReasonChips,
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
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { pending, networkError, submit } = useActionSubmit(kickServerMember);
  const [code, setCode] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const reason = draftReason({ code, otherText });
  const reasonText = reason ? reasonLabel({ ...reason, reasons: USER_ACTION_REASON }) : "";
  const canKick = Boolean(reason) && !pending;

  const kick = async () => {
    if (!reason) return;
    const result = await submit({ userId, reason });
    if (isUndefined(result)) return;
    onOpenChange(false);
    router.refresh();
    if (!result.ok) {
      toast.info(
        conflictToastText({ conflict: result.conflict, self: result.self, target: "추방" }),
      );
      return;
    }
    if (result.discordBanned) {
      toast.success(`${withObjectParticle(nickname)} ${server.name} 서버에서 추방했습니다`);
    } else {
      toast.danger("롤앤콜에서는 추방했지만 디스코드 차단은 실패했습니다");
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup initialFocus={cancelRef} className="max-w-[600px]">
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
            {networkError ? <ActionNetworkError /> : null}
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
            <ReasonChips
              label="추방 사유"
              reasons={USER_ACTION_REASON}
              value={code}
              otherText={otherText}
              onValueChange={setCode}
              onOtherTextChange={setOtherText}
              help="활동 기록에 남습니다."
              disabled={pending}
            />
            <ManualNoticePreview
              text={kickNoticeText({ serverName: server.name, reason: reasonText })}
            />
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <AlertDialog.Close
            ref={cancelRef}
            render={<Button variant="ghost" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </AlertDialog.Close>
          <Button
            colorPalette="danger"
            loading={pending}
            disabled={!canKick}
            onClick={() => void kick()}
          >
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "추방 확정"}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
