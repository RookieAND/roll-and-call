"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Callout, Field, Grid, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { ShieldCheck } from "lucide-react";

import type { GrantOptions } from "@/entities/cert/server";
import { NotificationPreview } from "@/entities/notification";
import { ActionNetworkError, FormSection, RetryableLabel, ServerLink, Tag } from "@/shared/ui";

import { GrantBookPicker } from "./grant-book-picker";
import { GrantMemberPicker } from "./grant-member-picker";
import { GrantSummary } from "./grant-summary";
import { useGrantCertification } from "./use-grant-certification";

interface GrantCertFormProps {
  options: GrantOptions;
  staffChannel: boolean;
  backHref: string;
}

export function GrantCertForm({ options, staffChannel, backHref }: GrantCertFormProps) {
  const {
    pending,
    networkError,
    bookIds,
    userIds,
    evidence,
    chosenBooks,
    chosen,
    receiving,
    grantCount,
    approving,
    approvingNames,
    canConfirm,
    changeBooks,
    setUserIds,
    setEvidence,
    confirm,
  } = useGrantCertification({ options, backHref });
  const [firstBook] = chosenBooks;

  return (
    <>
      <VStack gap="150" className="mx-auto w-full max-w-[1000px] flex-1 p-200">
        <Grid className="grid-cols-[minmax(0,1fr)_320px] items-start gap-200">
          <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
            {networkError ? <ActionNetworkError /> : null}
            <FormSection
              title="1. 인증할 룰북"
              description="사진 심사 없이 운영진의 판단으로 룰북 인증을 부여합니다. 여러 권을 한 번에 고를 수 있습니다."
              right={<Tag tone="primary">{`${chosenBooks.length}권 선택`}</Tag>}
            >
              <GrantBookPicker
                books={options.books}
                selectedIds={bookIds}
                disabled={pending}
                onChange={changeBooks}
              />
            </FormSection>
            <FormSection
              title="2. 인증할 유저"
              description="여러 명을 한 번에 고를 수 있습니다."
              right={<Tag tone="primary">{`${chosen.length}명 선택`}</Tag>}
            >
              <GrantMemberPicker
                options={options}
                books={chosenBooks}
                selectedIds={userIds}
                disabled={pending}
                onChange={setUserIds}
              />
              {approvingNames.length > 0 ? (
                <Callout.Root colorPalette="primary">
                  <Callout.Icon>
                    <ShieldCheck size={14} aria-hidden />
                  </Callout.Icon>
                  <Callout.Description>
                    {`${approvingNames.join(", ")}의 대기 중인 심사 신청은 이 인증과 함께 승인으로 처리되어 심사 대기열에서 빠집니다.`}
                  </Callout.Description>
                </Callout.Root>
              ) : null}
            </FormSection>
            <FormSection title="3. 부여 사유">
              <Field.Root
                label="부여 사유 (사용자에게 안 보임)"
                htmlFor="grant-evidence"
                required
                description="사진 없이 인증하므로 사유를 반드시 남겨 주세요. 활동 기록에 함께 표시됩니다."
              >
                <Textarea
                  id="grant-evidence"
                  rows={2}
                  value={evidence}
                  disabled={pending}
                  onChange={(event) => setEvidence(event.target.value)}
                />
              </Field.Root>
            </FormSection>
          </VStack>
          <GrantSummary
            rulebookLabels={chosenBooks.map((book) => book.label)}
            nicknames={receiving.map(({ member }) => member.nickname)}
            grantCount={grantCount}
            approving={approving}
          />
        </Grid>
        {firstBook ? (
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
        ) : null}
        {staffChannel ? (
          <Text typography="body4" foreground="hint">
            운영진 채널에 조치 글을 올립니다.
          </Text>
        ) : null}
      </VStack>
      <HStack
        align="center"
        gap="125"
        data-full-bleed
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
      >
        <Text typography="body4" foreground="hint">
          처리 내역은 활동 기록에 남습니다.
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
            loading={pending}
            disabled={!canConfirm}
            onClick={() => void confirm()}
            className="min-w-[128px]"
          >
            <RetryableLabel failed={networkError}>{"인증 확정"}</RetryableLabel>
          </Button>
        </HStack>
      </HStack>
    </>
  );
}
