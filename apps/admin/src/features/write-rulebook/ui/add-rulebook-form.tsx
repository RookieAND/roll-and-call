"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Card, Field, HStack, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import {
  ActionNetworkError,
  FormSection,
  NotificationPreview,
  RetryableLabel,
  ServerLink,
  useServerPath,
} from "@/shared/ui";

import { submitRulebookNew } from "../api/submit-rulebook-new";
import { categoryHelp } from "../model/category-help";
import { draftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { KindCards } from "./kind-cards";
import { MiniRuleField } from "./mini-rule-field";
import { RequestSummary } from "./request-summary";
import { SupersedesField } from "./supersedes-field";

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
  const router = useRouter();
  const toServerPath = useServerPath();
  const { pending, networkError, submit } = useActionSubmit(submitRulebookNew);
  const [draft, setDraft] = useState<RulebookDraft>({
    name: request?.bookName ?? "",
    edition: request?.edition ?? "",
    category: request ? (request.category ?? request.bookName) : initialCategory,
    categoryAlias: "",
    kind: request?.kind ?? "core",
    supersedesId: null,
    aliasesText: "",
    certRequired: true,
  });
  const [miniRule, setMiniRule] = useState(false);
  const [reason, setReason] = useState(request ? "추가 요청 승인" : "");
  const [duplicate, setDuplicate] = useState(false);

  const backHref = request ? "/rules?tab=requests" : "/rules";
  const categories = uniq(rulebooks.map((rulebook) => rulebook.category));
  const category = draftCategory(draft, rulebooks);
  const help =
    request && !category.exists && category.name === request.bookName
      ? "요청한 이름으로 새 카테고리를 만듭니다."
      : categoryHelp(category);
  const existingCategory = rulebooks.find((rulebook) => rulebook.category === category.name);
  const nameError = duplicate ? "이미 등록된 룰북입니다" : undefined;
  const canAdd =
    Boolean(draft.name.trim() && reason.trim()) && !category.error && !nameError && !pending;
  const footerNote = request
    ? "추가하면 요청은 처리됨으로 바뀌고, 처리 내역은 활동 기록에 남습니다."
    : "추가한 내용과 사유는 활동 기록에 남습니다.";
  const change = (changes: Partial<RulebookDraft>) => {
    setDraft({ ...draft, ...changes });
    setDuplicate(false);
  };

  const add = async () => {
    const result = await submit({
      requestId: request?.id ?? null,
      draft: { ...draft, supersedesId: category.supersedesId },
      miniRule,
      reason,
    });
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(`「${draft.name.trim()}」 룰북을 추가했습니다`);
      router.push(toServerPath(backHref));
      return;
    }
    if ("duplicate" in result) {
      setDuplicate(true);
      return;
    }
    const conflict = result.conflict;
    toast.info(conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "요청" }));
    router.push(toServerPath(backHref));
  };

  return (
    <VStack data-full-bleed className="min-h-0 flex-1">
      <VStack gap="150" className="mx-auto w-full max-w-[880px] flex-1 p-200">
        {request ? <RequestSummary request={request} /> : null}
        <Card.Root padding="lg">
          <VStack gap="250">
            {networkError ? <ActionNetworkError /> : null}
            <FormSection title="1. 책 정보" description="같은 TRPG의 책은 한 카테고리로 묶습니다.">
              <BasicInfoFields
                draft={draft}
                categories={categories}
                idPrefix="add-rulebook"
                categoryHelp={help}
                categoryError={category.error}
                nameError={nameError}
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
              <SupersedesField
                draft={draft}
                category={category}
                idPrefix="add-rulebook"
                disabled={pending}
                onChange={(supersedesId) => change({ supersedesId })}
              />
            </FormSection>
            <FormSection title="3. 인증 정책">
              <CertPolicyField
                certRequired={draft.certRequired}
                disabled={pending}
                onChange={(certRequired) => change({ certRequired })}
              />
            </FormSection>
            <FormSection title="4. 미니룰">
              <MiniRuleField
                miniRule={existingCategory ? existingCategory.categoryMiniRule : miniRule}
                disabled={pending || category.exists}
                onChange={setMiniRule}
              />
            </FormSection>
            <Field.Root label="변경 사유" htmlFor="add-rulebook-reason" required>
              <Textarea
                id="add-rulebook-reason"
                rows={2}
                placeholder="입력한 사유는 활동 기록에 남습니다"
                value={reason}
                disabled={pending}
                onChange={(event) => setReason(event.target.value)}
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
            {footerNote}
          </Text>
        )}
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
            disabled={!canAdd}
            onClick={() => void add()}
            className="min-w-[104px]"
          >
            <RetryableLabel failed={networkError}>{"추가"}</RetryableLabel>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
