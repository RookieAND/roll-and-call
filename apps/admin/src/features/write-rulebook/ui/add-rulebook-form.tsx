"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Card, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";

import { NotificationPreview } from "@/entities/notification";
import type { RulebookRequestRow, RulebookRow } from "@/entities/rulebook/server";
import { ActionNetworkError, FormSection, RetryableLabel, ServerLink } from "@/shared/ui";

import { useAddRulebookForm } from "../model/use-add-rulebook-form";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { CoveredBooksField } from "./covered-books-field";
import { KindCards } from "./kind-cards";
import { MiniRuleField } from "./mini-rule-field";
import { RequestSummary } from "./request-summary";

interface AddRulebookFormProps {
  rulebooks: RulebookRow[];
  // 추가 요청에서 열었으면 그 요청. 추가하면 요청은 처리됨으로 바뀐다.
  request: RulebookRequestRow | null;
  initialCategory?: string;
  viewerId: string;
}

export function AddRulebookForm({
  rulebooks,
  request,
  initialCategory = "",
  viewerId,
}: AddRulebookFormProps) {
  const form = useAddRulebookForm({ rulebooks, request, initialCategory, viewerId });
  const { draft, change, category, pending, networkError } = form;

  return (
    <VStack data-full-bleed className="min-h-0 flex-1">
      <VStack gap="150" className="mx-auto w-full max-w-content flex-1 p-200">
        {request ? <RequestSummary request={request} /> : null}
        <Card.Root padding="lg">
          <VStack gap="250">
            {networkError ? <ActionNetworkError /> : null}
            <FormSection title="1. 책 정보" description="같은 TRPG의 책은 한 카테고리로 묶습니다.">
              <BasicInfoFields
                draft={draft}
                categories={form.categories}
                idPrefix="add-rulebook"
                categoryHelp={form.help}
                categoryError={category.error}
                nameError={form.nameError}
                disabled={pending}
                onChange={change}
              />
            </FormSection>
            <FormSection
              title="2. 종류"
              description="종류에 따라 GM 자격과 인증 신청 조건이 정해집니다."
            >
              <KindCards
                kind={draft.kind}
                disabled={pending}
                onChange={(kind) => change({ kind })}
              />
            </FormSection>
            <FormSection title="3. 인증 정책">
              <CertPolicyField
                certRequired={draft.certRequired}
                disabled={pending}
                onChange={(certRequired) => change({ certRequired })}
              />
            </FormSection>
            <FormSection title="4. 함께 인증되는 책">
              <CoveredBooksField
                draft={draft}
                category={category}
                disabled={pending}
                onChange={change}
              />
            </FormSection>
            <FormSection title="5. 미니룰">
              <MiniRuleField
                miniRule={
                  form.existingCategory ? form.existingCategory.categoryMiniRule : form.miniRule
                }
                disabled={pending || category.exists}
                onChange={form.setMiniRule}
              />
            </FormSection>
            <Field.Root label="변경 사유" htmlFor="add-rulebook-reason" required>
              <Textarea
                id="add-rulebook-reason"
                rows={2}
                placeholder="입력한 사유는 활동 기록에 남습니다"
                value={form.reason}
                disabled={pending}
                onChange={(event) => form.setReason(event.target.value)}
              />
            </Field.Root>
          </VStack>
        </Card.Root>
        {request ? (
          <NotificationPreview
            payload={{
              kind: NOTIFICATION_KIND.rulebookRequestAdded,
              params: { rulebookName: request.name },
            }}
            recipients="요청자의 알림 탭으로 알립니다."
          />
        ) : null}
      </VStack>
      <HStack
        align="center"
        gap="125"
        data-full-bleed
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
      >
        {category.error ? (
          <Text typography="body4" foreground="hint" className="inline-flex items-center gap-075">
            <TriangleAlert size={14} aria-hidden />
            카테고리를 골라야 추가할 수 있습니다
          </Text>
        ) : (
          <Text typography="body4" foreground="hint">
            {form.footerNote}
          </Text>
        )}
        <HStack gap="100" className="ml-auto">
          <Button
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            render={<ServerLink path={form.backHref} />}
          >
            취소
          </Button>
          <Button
            loading={pending}
            disabled={!form.canAdd}
            onClick={() => void form.add()}
            className="min-w-[104px]"
          >
            <RetryableLabel failed={networkError}>{"추가"}</RetryableLabel>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
