"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Callout, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { ShieldCheck } from "lucide-react";

import type { GrantOptions } from "@/entities/cert/server";
import { NotificationPreview } from "@/entities/notification";
import { ActionNetworkError, KeyValueList, RetryableLabel, ServerLink, Tag } from "@/shared/ui";

import { grantBlockedReason } from "../model/grant-blocked-reason";
import { GrantSelectedChips } from "./grant-selected-chips";
import { MobileGrantBookSheet } from "./mobile-grant-book-sheet";
import { MobileGrantFold } from "./mobile-grant-fold";
import { MobileGrantMemberSheet } from "./mobile-grant-member-sheet";
import { MobileGrantSection } from "./mobile-grant-section";
import { useGrantCertification } from "./use-grant-certification";

interface MobileGrantCertFormProps {
  options: GrantOptions;
  staffChannel: boolean;
  backHref: string;
}

// 한 열로 쌓고 요약은 입력 아래 접힌 한 줄로 내린다. 확정 버튼은 아래에 고정하고 막힌 이유를 버튼 위 한 줄로 알린다.
export function MobileGrantCertForm({ options, staffChannel, backHref }: MobileGrantCertFormProps) {
  const grant = useGrantCertification({ options, backHref });
  const { chosenBooks, chosen, receiving, pending } = grant;
  const [firstBook] = chosenBooks;
  const several = chosenBooks.length > 1;
  const summary = [
    { label: "인증을 부여할 룰북", value: `${chosenBooks.length}권` },
    { label: "인증을 받는 유저", value: `${receiving.length}명` },
    ...(several ? [{ label: "새로 부여되는 인증", value: `${grant.grantCount}건` }] : []),
    { label: "승인으로 처리되는 심사", value: `${grant.approving.length}건` },
  ];
  const blockedReason = grantBlockedReason({
    bookCount: chosenBooks.length,
    userCount: chosen.length,
    evidence: grant.evidence,
  });

  return (
    <>
      <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
        <MobileGrantSection
          title="1. 인증할 룰북"
          description="사진 심사 없이 운영진의 판단으로 룰북 인증을 부여합니다. 여러 권을 한 번에 고를 수 있습니다."
          tag={<Tag tone="primary">{`${chosenBooks.length}권 선택`}</Tag>}
        >
          {chosenBooks.length > 0 ? (
            <GrantSelectedChips
              noun="룰북"
              unit="권"
              items={chosenBooks}
              disabled={pending}
              onRemove={(bookId) => grant.changeBooks(grant.bookIds.filter((id) => id !== bookId))}
            />
          ) : null}
          <MobileGrantBookSheet
            books={options.books}
            selectedIds={grant.bookIds}
            disabled={pending}
            onChange={grant.changeBooks}
          />
        </MobileGrantSection>
        <MobileGrantSection
          title="2. 인증할 유저"
          description="여러 명을 한 번에 고를 수 있습니다."
          tag={<Tag tone="primary">{`${chosen.length}명 선택`}</Tag>}
        >
          {chosen.length > 0 ? (
            <GrantSelectedChips
              noun="유저"
              unit="명"
              items={chosen.map((member) => ({ id: member.id, label: member.nickname }))}
              disabled={pending}
              onRemove={(memberId) =>
                grant.setUserIds(grant.userIds.filter((id) => id !== memberId))
              }
            />
          ) : null}
          <MobileGrantMemberSheet
            options={options}
            books={chosenBooks}
            selectedIds={grant.userIds}
            disabled={pending}
            onChange={grant.setUserIds}
          />
          {grant.approvingNames.length > 0 ? (
            <Callout.Root colorPalette="primary">
              <Callout.Icon>
                <ShieldCheck size={14} aria-hidden />
              </Callout.Icon>
              <Callout.Description>
                {`${grant.approvingNames.join(", ")}의 대기 중인 심사 신청은 이 인증과 함께 승인으로 처리되어 심사 대기열에서 빠집니다.`}
              </Callout.Description>
            </Callout.Root>
          ) : null}
        </MobileGrantSection>
        <MobileGrantSection title="3. 부여 사유">
          <Field.Root
            label="부여 사유 (사용자에게 안 보임)"
            htmlFor="mobile-grant-evidence"
            required
            description="사진 없이 인증하므로 사유를 반드시 남겨 주세요. 활동 기록에 함께 표시됩니다."
          >
            <Textarea
              id="mobile-grant-evidence"
              rows={3}
              value={grant.evidence}
              disabled={pending}
              enterKeyHint="done"
              onChange={(event) => grant.setEvidence(event.target.value)}
            />
          </Field.Root>
        </MobileGrantSection>
        <MobileGrantFold
          title="확정하면 일어나는 일"
          summary={summary.map((item) => item.value).join(" · ")}
        >
          <KeyValueList items={summary} />
        </MobileGrantFold>
        {firstBook ? (
          <MobileGrantFold title="알림 미리보기" summary="당사자의 알림 탭">
            <NotificationPreview
              payload={{
                kind: NOTIFICATION_KIND.certGranted,
                params: {
                  rulebookId: firstBook.id,
                  rulebookName: firstBook.label,
                  otherCount: chosenBooks.length - 1,
                },
              }}
              recipients={`고른 유저 ${receiving.length}명의 알림 탭으로 알립니다.`}
            />
          </MobileGrantFold>
        ) : null}
        {staffChannel ? (
          <Text typography="body4" foreground="hint">
            운영진 채널에 조치 글을 올립니다.
          </Text>
        ) : null}
      </VStack>
      <VStack
        gap="075"
        className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-100 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]"
      >
        {grant.networkError ? <ActionNetworkError /> : null}
        <Text
          typography="body4"
          foreground={blockedReason ? "hint" : "muted"}
          className="text-center"
        >
          {blockedReason ??
            `룰북 ${chosenBooks.length}권 · 유저 ${receiving.length}명 · 인증 ${grant.grantCount}건을 부여합니다`}
        </Text>
        <HStack gap="100">
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={pending}
            render={<ServerLink path={backHref} />}
            className="min-h-12 flex-1"
          >
            취소
          </Button>
          <Button
            loading={pending}
            disabled={!grant.canConfirm}
            onClick={() => void grant.confirm()}
            className="min-h-12 flex-1"
          >
            <RetryableLabel failed={grant.networkError}>{"인증 확정"}</RetryableLabel>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
