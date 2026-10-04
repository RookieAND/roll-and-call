"use client";

import {
  Button,
  Checkbox,
  Field,
  Grid,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  cn,
  toast,
} from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDate, formatSessionTime } from "@/shared/lib";
import type { OngoingActivity, UserDetail } from "@/shared/server";
import {
  ChoiceRowList,
  FormSection,
  ServerLink,
  Tag,
  useServerPath,
  type ChoiceRow,
} from "@/shared/ui";

import { revokeUserCertifications } from "../api/revoke-user-certifications";
import { RevokeConfirmDialog } from "./revoke-confirm-dialog";
import { RevokeSummary } from "./revoke-summary";

const HOSTED_OPTIONS = [
  { value: "keep", label: "구인 진행" },
  { value: "cancel", label: "구인 취소" },
] as const;

interface RevokeCertFormProps {
  userId: string;
  nickname: string;
  certifications: UserDetail["certifications"];
  initialRulebookId?: string;
  ongoing: OngoingActivity[];
  backHref: string;
}

export function RevokeCertForm({
  userId,
  nickname,
  certifications,
  initialRulebookId,
  ongoing,
  backHref,
}: RevokeCertFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [pending, startTransition] = useTransition();
  const [rulebookIds, setRulebookIds] = useState(initialRulebookId ? [initialRulebookId] : []);
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [closedSessionIds, setClosedSessionIds] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);

  const selectedRulebooks = certifications
    .filter((certification) => rulebookIds.includes(certification.rulebookId))
    .map((certification) => certification.rulebook);
  const rows: ChoiceRow[] = ongoing
    .filter((activity) => activity.hosted && selectedRulebooks.includes(activity.rulebook))
    .map((activity) => ({
      id: activity.sessionId,
      title: activity.title,
      meta: `${formatSessionTime(activity.startsAt)} · 모집 중 ${activity.memberCount}/${activity.capacity}`,
      options: HOSTED_OPTIONS,
      value: closedSessionIds.includes(activity.sessionId) ? "cancel" : "keep",
    }));
  const closedCount = rows.filter((row) => row.value === "cancel").length;
  const reason = userReason.trim();
  const canRevoke = selectedRulebooks.length > 0 && Boolean(reason) && !pending;

  const toggleRulebook = (rulebookId: string, checked: boolean) =>
    setRulebookIds(
      checked ? [...rulebookIds, rulebookId] : rulebookIds.filter((item) => item !== rulebookId),
    );

  const changeChoice = (sessionId: string, value: string) =>
    setClosedSessionIds(
      value === "cancel"
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
          .filter((row) => row.value === "cancel")
          .map((row) => ({ sessionId: row.id, action: "cancel" })),
      });
      setConfirming(false);
      if (result.ok) toast.success(`${nickname}님의 룰북 인증을 반려로 돌렸습니다`);
      else toast.info("이미 반려로 돌린 인증입니다");
      router.push(toServerPath(backHref));
    });

  return (
    <>
      <Grid className="mx-auto w-full max-w-[1000px] flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
          <FormSection
            title="1. 반려로 돌릴 룰북"
            description={`인증된 룰북 ${certifications.length}개 가운데 반려로 돌릴 룰북을 고릅니다. 여러 개를 함께 고를 수 있습니다.`}
          >
            <VStack className="divide-y divide-(--rc-color-border-subtle) overflow-hidden rounded-400 border border-gray-200">
              {certifications.map((certification) => {
                const checked = rulebookIds.includes(certification.rulebookId);
                return (
                  <div
                    key={certification.rulebookId}
                    className={cn("px-150 py-100", checked && "bg-tinted-bg")}
                  >
                    <Checkbox.Field>
                      <Checkbox.Root
                        checked={checked}
                        onCheckedChange={(next) => toggleRulebook(certification.rulebookId, next)}
                      >
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                      <Checkbox.Label>
                        <VStack render={<span />}>
                          <Text typography="body3" weight="bold">
                            {certification.rulebook}
                          </Text>
                          <Text typography="body4" foreground="hint">
                            {`${formatDate(certification.approvedAt)} 인증`}
                          </Text>
                        </VStack>
                      </Checkbox.Label>
                    </Checkbox.Field>
                  </div>
                );
              })}
            </VStack>
          </FormSection>
          <FormSection title="2. 반려 사유">
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
            description="기본값은 구인 진행입니다. 닫을 구인만 바꿔 주세요."
            right={<Tag>{`${rows.length}건`}</Tag>}
          >
            {rows.length > 0 ? (
              <>
                <ChoiceRowList rows={rows} onChange={changeChoice} />
                <Text typography="body4" foreground="hint">
                  구인을 닫으면 참여자에게 운영진 조치로 닫혔다는 알림이 전송됩니다.
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
          확정하면 다른 운영진에게 디스코드 알림이 전송되고, 처리 내역은 활동 기록에 남습니다.
        </Text>
        <HStack gap="100" className="ml-auto">
          <Button
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            render={<ServerLink path={backHref} />}
          >
            취소
          </Button>
          <Button
            colorPalette="danger"
            disabled={!canRevoke}
            onClick={() => setConfirming(true)}
            className="min-w-[128px]"
          >
            반려로 돌리기
          </Button>
        </HStack>
      </HStack>
      <RevokeConfirmDialog
        open={confirming}
        nickname={nickname}
        rulebooks={selectedRulebooks}
        userReason={reason}
        closedCount={closedCount}
        pending={pending}
        onBack={() => setConfirming(false)}
        onConfirm={revoke}
      />
    </>
  );
}
