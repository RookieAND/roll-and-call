"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";

import { NotificationPreview } from "@/entities/notification";
import type { RulebookRequestRow, RulebookRow } from "@/entities/rulebook/server";
import { ActionNetworkError, MobileActionBar, RetryableLabel, ServerLink } from "@/shared/ui";

import { useAddRulebookForm } from "../model/use-add-rulebook-form";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { IncludedSupplementsField } from "./included-supplements-field";
import { KindCards } from "./kind-cards";
import { MiniRuleField } from "./mini-rule-field";
import { MobileFormSection } from "./mobile-form-section";
import { RequestSummary } from "./request-summary";
import { SupersedesField } from "./supersedes-field";

const ID_PREFIX = "add-rulebook-mobile";

interface MobileAddRulebookFormProps {
  rulebooks: RulebookRow[];
  request: RulebookRequestRow | null;
  initialCategory?: string;
  viewerId: string;
}

export function MobileAddRulebookForm({
  rulebooks,
  request,
  initialCategory = "",
  viewerId,
}: MobileAddRulebookFormProps) {
  const form = useAddRulebookForm({ rulebooks, request, initialCategory, viewerId });
  const { draft, change, category, pending, networkError } = form;
  return (
    <>
      <VStack gap="150" className="p-150 pb-200">
        {request ? <RequestSummary request={request} /> : null}
        {networkError ? <ActionNetworkError /> : null}
        <MobileFormSection title="1. 책 정보">
          <BasicInfoFields
            stacked
            draft={draft}
            categories={form.categories}
            idPrefix={ID_PREFIX}
            categoryHelp={form.help}
            categoryError={category.error}
            nameError={form.nameError}
            disabled={pending}
            onChange={change}
          />
        </MobileFormSection>
        <MobileFormSection title="2. 종류">
          <KindCards kind={draft.kind} disabled={pending} onChange={(kind) => change({ kind })} />
          <SupersedesField
            draft={draft}
            category={category}
            idPrefix={ID_PREFIX}
            disabled={pending}
            onChange={(supersedesId) => change({ supersedesId })}
          />
          <IncludedSupplementsField
            draft={draft}
            category={category}
            disabled={pending}
            onChange={(includedSupplementIds) => change({ includedSupplementIds })}
          />
        </MobileFormSection>
        <MobileFormSection title="3. 인증 정책">
          <CertPolicyField
            stacked
            certRequired={draft.certRequired}
            disabled={pending}
            onChange={(certRequired) => change({ certRequired })}
          />
        </MobileFormSection>
        <MobileFormSection title="4. 미니룰">
          <MiniRuleField
            miniRule={
              form.existingCategory ? form.existingCategory.categoryMiniRule : form.miniRule
            }
            disabled={pending || category.exists}
            onChange={form.setMiniRule}
          />
        </MobileFormSection>
        <MobileFormSection title="변경 사유">
          <Field.Root label="사유" htmlFor={`${ID_PREFIX}-reason`} required>
            <Textarea
              id={`${ID_PREFIX}-reason`}
              rows={2}
              enterKeyHint="done"
              placeholder="입력한 사유는 활동 기록에 남습니다"
              value={form.reason}
              disabled={pending}
              onChange={(event) => form.setReason(event.target.value)}
            />
          </Field.Root>
        </MobileFormSection>
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
      <MobileActionBar elevated={false}>
        <Text typography="body4" foreground="hint">
          {category.error ? "카테고리를 골라야 추가할 수 있습니다" : form.footerNote}
        </Text>
        <HStack gap="100">
          <Button
            variant="outline"
            size="lg"
            disabled={pending}
            render={<ServerLink path={form.backHref} />}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            size="lg"
            loading={pending}
            disabled={!form.canAdd}
            onClick={() => void form.add()}
            className="flex-1"
          >
            <RetryableLabel failed={networkError}>{"추가"}</RetryableLabel>
          </Button>
        </HStack>
      </MobileActionBar>
    </>
  );
}
