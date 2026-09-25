"use client";

import {
  Badge,
  Button,
  Checkbox,
  Field,
  Grid,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDate, formatSessionTime } from "@/shared/lib";
import type { OngoingActivity, UserDetail } from "@/shared/server";
import { FormSection, OngoingChoiceList, type OngoingChoiceRow } from "@/shared/ui";

import { revokeUserCertifications } from "../api/revoke-user-certifications";
import { RevokeSummary } from "./revoke-summary";

interface RevokeCertFormProps {
  userId: string;
  nickname: string;
  certifications: UserDetail["certifications"];
  initialRulebook?: string;
  ongoing: OngoingActivity[];
  backHref: string;
}

export function RevokeCertForm({
  userId,
  nickname,
  certifications,
  initialRulebook,
  ongoing,
  backHref,
}: RevokeCertFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rulebooks, setRulebooks] = useState(initialRulebook ? [initialRulebook] : []);
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [closedSessionIds, setClosedSessionIds] = useState<string[]>([]);

  const selectedRulebooks = certifications
    .map((certification) => certification.rulebook)
    .filter((rulebook) => rulebooks.includes(rulebook));
  const rows: OngoingChoiceRow[] = ongoing
    .filter((activity) => activity.hosted && selectedRulebooks.includes(activity.rulebook))
    .map((activity) => ({
      id: activity.sessionId,
      title: activity.title,
      meta: `${formatSessionTime(activity.startsAt)} · 모집 중 ${activity.memberCount}/${activity.capacity}`,
      alternativeLabel: "구인 닫기",
      action: closedSessionIds.includes(activity.sessionId) ? "close" : "keep",
      alternativeAction: "close",
    }));
  const closedCount = rows.filter((row) => row.action === "close").length;
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
      else toast.info("이미 취소된 인증입니다");
      router.push(backHref);
    });

  return (
    <>
      <Grid className="mx-auto w-full max-w-[1000px] flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
          <FormSection
            title="1. 취소할 룰북"
            description={`인증된 룰북 ${certifications.length}개 가운데 취소할 룰북을 고릅니다. 여러 개를 고를 수 있습니다.`}
          >
            <VStack gap="075" className="rounded-400 border border-gray-200 px-150 py-100">
              {certifications.map((certification) => (
                <Checkbox.Field key={certification.rulebook}>
                  <Checkbox.Root
                    checked={rulebooks.includes(certification.rulebook)}
                    onCheckedChange={(checked) => toggleRulebook(certification.rulebook, checked)}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <Checkbox.Label>
                    <b>{certification.rulebook}</b> · {formatDate(certification.approvedAt)} 인증
                  </Checkbox.Label>
                </Checkbox.Field>
              ))}
            </VStack>
          </FormSection>
          <FormSection
            title="2. 취소 사유"
            description="사용자에게 보이는 사유와 운영진끼리만 보는 메모를 나누어 적습니다."
          >
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
                rows={2}
                placeholder="선택"
                value={staffMemo}
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
          </FormSection>
          <FormSection
            title="3. 이 룰북으로 진행 중인 구인"
            description="기본값은 그대로 진행입니다. 닫을 구인만 골라 주세요."
            right={<Badge colorPalette="gray">{rows.length}건</Badge>}
          >
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
          </FormSection>
        </VStack>
        <RevokeSummary
          rulebooks={selectedRulebooks}
          userReason={userReason}
          closedCount={closedCount}
          keptCount={rows.length - closedCount}
        />
      </Grid>
      <HStack
        align="center"
        gap="125"
        data-full-bleed
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
      >
        <Text typography="body4" foreground="hint">
          확정하면 다른 운영진에게 디스코드 알림이 갑니다. 취소한 인증은 활동 기록에 남습니다.
        </Text>
        <HStack gap="100" className="ml-auto">
          <Button
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            render={<Link href={backHref} />}
          >
            취소
          </Button>
          <Button
            colorPalette="danger"
            loading={pending}
            disabled={!canRevoke}
            onClick={revoke}
            className="min-w-[128px]"
          >
            인증 취소 확정
          </Button>
        </HStack>
      </HStack>
    </>
  );
}
