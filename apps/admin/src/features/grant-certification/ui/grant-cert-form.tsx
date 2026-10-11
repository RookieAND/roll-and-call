"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import {
  Button,
  Callout,
  Field,
  Grid,
  HStack,
  Text,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useActionSubmit } from "@/shared/lib";
import type { GrantOptions } from "@/shared/server";
import {
  ActionNetworkError,
  FormSection,
  NotificationPreview,
  RetryableLabel,
  ServerLink,
  Tag,
  useServerPath,
} from "@/shared/ui";

import { grantUserCertifications } from "../api/grant-user-certifications";
import { grantMemberPlan } from "../model/grant-candidate-status";
import { grantResultToast } from "../model/grant-result-toast";
import { GrantBookPicker } from "./grant-book-picker";
import { GrantMemberPicker } from "./grant-member-picker";
import { GrantSummary } from "./grant-summary";

interface GrantCertFormProps {
  options: GrantOptions;
  staffChannel: boolean;
  backHref: string;
}

export function GrantCertForm({ options, staffChannel, backHref }: GrantCertFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(grantUserCertifications);
  const [bookIds, setBookIds] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [evidence, setEvidence] = useState("");

  const chosenBooks = options.books.filter((candidate) => bookIds.includes(candidate.id));
  const planOf = (userId: string, books: typeof chosenBooks) =>
    grantMemberPlan({ userId, books, options });
  const chosen = options.members.filter((member) => userIds.includes(member.id));
  const plans = chosen.map((member) => ({ member, plan: planOf(member.id, chosenBooks) }));
  // 부여할 룰북이 하나도 없는 유저는 확정 대상에서 뺀다. 고른 룰북이 있으면 인증 건수로 센다.
  const receiving = plans.filter(({ plan }) => plan.grantable.length > 0);
  const grantCount = receiving.reduce((sum, { plan }) => sum + plan.grantable.length, 0);
  const approving = plans.flatMap(({ member, plan }) =>
    plan.approving.map((book) => ({ nickname: member.nickname, label: book.label })),
  );
  const approvingNames = uniq(approving.map((row) => row.nickname));
  const [firstBook] = chosenBooks;
  const canConfirm =
    chosenBooks.length > 0 && receiving.length > 0 && Boolean(evidence.trim()) && !pending;

  const changeBooks = (nextIds: string[]) => {
    const next = options.books.filter((candidate) => nextIds.includes(candidate.id));
    setBookIds(nextIds);
    // 고른 룰북이 바뀌어 부여할 책이 하나도 남지 않은 유저는 선택에서 뺀다.
    setUserIds(
      userIds.filter((userId) => next.length === 0 || planOf(userId, next).grantable.length > 0),
    );
  };

  const confirm = async () => {
    if (chosenBooks.length === 0) return;
    const result = await submit({
      rulebookIds: chosenBooks.map((book) => book.id),
      userIds: receiving.map(({ member }) => member.id),
      evidence,
    });
    if (isUndefined(result)) return;
    if (!result.ok) {
      toast.danger(result.error);
      return;
    }
    const outcome = grantResultToast(result);
    if (!outcome.success) {
      toast.info(outcome.title);
      router.refresh();
      return;
    }
    router.push(toServerPath(backHref));
    toast.success(outcome.title, { description: outcome.description });
  };

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
              params: { rulebookId: firstBook.id, rulebookName: firstBook.label },
            }}
            recipients={
              chosenBooks.length > 1
                ? `고른 유저 ${receiving.length}명의 알림 탭으로 룰북마다 1건씩 알립니다. 위는 ${firstBook.label}의 알림입니다.`
                : `고른 유저 ${receiving.length}명의 알림 탭으로 알립니다.`
            }
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
