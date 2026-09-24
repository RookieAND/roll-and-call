"use client";

import {
  AlertDialog,
  Button,
  Checkbox,
  Field,
  Text,
  TextInput,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { formatDate, formatSessionTime } from "@/shared/lib";
import type { OngoingActivity, UserDetail } from "@/shared/server";
import { OngoingChoiceList, UserPreview, type OngoingChoiceRow } from "@/shared/ui";

import { revokeUserCertifications } from "../api/revoke-user-certifications";

interface RevokeCertDialogProps {
  userId: string;
  nickname: string;
  certifications: UserDetail["certifications"];
  initialRulebook?: string;
  ongoing: OngoingActivity[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RevokeCertDialog({
  userId,
  nickname,
  certifications,
  initialRulebook,
  ongoing,
  open,
  onOpenChange,
}: RevokeCertDialogProps) {
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, startTransition] = useTransition();
  const [wasOpen, setWasOpen] = useState(open);
  const [rulebooks, setRulebooks] = useState(initialRulebook ? [initialRulebook] : []);
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [closedSessionIds, setClosedSessionIds] = useState<string[]>([]);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setRulebooks(initialRulebook ? [initialRulebook] : []);
      setUserReason("");
      setStaffMemo("");
      setClosedSessionIds([]);
    }
  }

  const affected = ongoing.filter(
    (activity) => activity.hosted && rulebooks.includes(activity.rulebook),
  );
  const rows: OngoingChoiceRow[] = affected.map((activity) => ({
    id: activity.sessionId,
    title: activity.title,
    meta: `${formatSessionTime(activity.startsAt)} · 모집 중 ${activity.memberCount}/${activity.capacity}`,
    alternativeLabel: "구인 닫기",
    action: closedSessionIds.includes(activity.sessionId) ? "close" : "keep",
    alternativeAction: "close",
  }));
  const selectedRulebooks = certifications
    .map((certification) => certification.rulebook)
    .filter((rulebook) => rulebooks.includes(rulebook));
  const canRevoke = selectedRulebooks.length > 0 && Boolean(userReason.trim()) && !pending;

  const toggleRulebook = (rulebook: string, checked: boolean) =>
    setRulebooks(
      checked ? [...rulebooks, rulebook] : rulebooks.filter((item) => item !== rulebook),
    );

  const changeChoice = (sessionId: string, action: string) =>
    setClosedSessionIds(
      action === "close"
        ? [...closedSessionIds, sessionId]
        : closedSessionIds.filter((item) => item !== sessionId),
    );

  const revoke = () =>
    startTransition(async () => {
      const result = await revokeUserCertifications(userId, {
        rulebooks: selectedRulebooks,
        userReason,
        staffMemo,
        ongoing: rows
          .filter((row) => row.action === "close")
          .map((row) => ({ sessionId: row.id, action: "close" })),
      });
      if (result.ok) toast.success(`${nickname}님의 룰북 인증을 취소했습니다`);
      else {
        toast.info("이미 취소된 인증입니다");
        router.refresh();
      }
      onOpenChange(false);
    });

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <AlertDialog.Popup initialFocus={cancelRef} className="max-w-[600px]">
        <AlertDialog.Header>
          <AlertDialog.Title>{nickname} 룰북 인증 취소</AlertDialog.Title>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="150">
            <VStack gap="075">
              <Text typography="body4" weight="bold">
                취소할 룰북
              </Text>
              <VStack>
                {certifications.map((certification) => (
                  <Checkbox.Field key={certification.rulebook}>
                    <Checkbox.Root
                      checked={rulebooks.includes(certification.rulebook)}
                      onCheckedChange={(checked) => toggleRulebook(certification.rulebook, checked)}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Checkbox.Label>
                      <Text typography="body3">
                        <Text typography="body3" weight="bold" render={<span />}>
                          {certification.rulebook}
                        </Text>{" "}
                        · {formatDate(certification.approvedAt)} 인증
                      </Text>
                    </Checkbox.Label>
                  </Checkbox.Field>
                ))}
              </VStack>
            </VStack>
            <Field.Root
              label="사용자에게 보여줄 사유"
              htmlFor="revoke-user-reason"
              required
              description="입력한 사유는 사용자 화면에서 ‘사유:’ 뒤에 그대로 표시됩니다."
            >
              <TextInput
                id="revoke-user-reason"
                value={userReason}
                onChange={(event) => setUserReason(event.target.value)}
              />
            </Field.Root>
            <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="revoke-staff-memo">
              <Textarea
                id="revoke-staff-memo"
                rows={1}
                placeholder="선택"
                value={staffMemo}
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
            <VStack gap="075">
              <Text typography="body4" weight="bold">
                이 룰북으로 진행 중인 구인
              </Text>
              {rows.length > 0 ? (
                <>
                  <OngoingChoiceList rows={rows} onChange={changeChoice} />
                  <Text typography="body4" foreground="hint">
                    닫힌 구인에 참여한 사용자에게 운영진 조치로 닫혔다는 알림이 갑니다.
                  </Text>
                </>
              ) : (
                <Text typography="body4" foreground="hint">
                  이 룰북으로 진행 중인 구인이 없습니다
                </Text>
              )}
            </VStack>
            <UserPreview>
              「{selectedRulebooks.join("」, 「")}」 룰북 인증이 취소됐어요. 사유:{" "}
              {userReason.trim()}. 다시 인증받기 전까지 이 룰북으로 구인을 열 수 없어요. 이의가
              있다면 디스코드 #문의 채널로 알려주세요.
            </UserPreview>
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <Text typography="body4" foreground="hint" className="mr-auto">
            확정하면 다른 운영진에게 디스코드 알림이 갑니다
          </Text>
          <Button
            ref={cancelRef}
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button colorPalette="danger" loading={pending} disabled={!canRevoke} onClick={revoke}>
            인증 취소 확정
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
