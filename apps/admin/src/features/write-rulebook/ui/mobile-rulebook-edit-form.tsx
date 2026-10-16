"use client";

import { Button, Field, HStack, TextInput, VStack } from "@roll-and-call/ui";

import type { RulebookDetail } from "@/entities/rulebook/server";
import { ActionNetworkError, MobileActionBar } from "@/shared/ui";

import { useRulebookEditForm } from "../model/use-rulebook-edit-form";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { KindCards } from "./kind-cards";
import { MobileFormSection } from "./mobile-form-section";
import { RulebookEditDialogs } from "./rulebook-edit-dialogs";
import { SupersedesField } from "./supersedes-field";

const ID_PREFIX = "rulebook-mobile";

interface MobileRulebookEditFormProps {
  rulebook: RulebookDetail;
  viewerId: string;
}

// 입력란은 한 줄에 하나씩 쌓고, 저장과 숨김은 화면 아래에 고정한다.
export function MobileRulebookEditForm({ rulebook, viewerId }: MobileRulebookEditFormProps) {
  const form = useRulebookEditForm({ rulebook, viewerId });
  const { draft, pending } = form;
  return (
    <>
      <VStack gap="150" className="p-150 pb-200">
        {(form.saving.networkError && !form.dialogOpen) || form.unhiding.networkError ? (
          <ActionNetworkError />
        ) : null}
        <MobileFormSection title="기본 정보">
          <BasicInfoFields
            stacked
            draft={draft}
            categories={form.categories}
            idPrefix={ID_PREFIX}
            categoryHelp={form.categoryHint}
            categoryError={form.category.error}
            nameError={form.nameError}
            disabled={pending}
            onChange={form.change}
          >
            <Field.Root
              label="종류"
              description={form.certifiedCount > 0 ? form.kindDescription : undefined}
            >
              <KindCards
                kind={draft.kind}
                disabled={pending}
                onChange={(kind) => form.change({ kind })}
              />
            </Field.Root>
            <SupersedesField
              draft={draft}
              category={form.category}
              idPrefix={ID_PREFIX}
              disabled={pending}
              onChange={(supersedesId) => form.change({ supersedesId })}
            />
          </BasicInfoFields>
        </MobileFormSection>
        <MobileFormSection title="인증 정책">
          <CertPolicyField
            stacked
            certRequired={draft.certRequired}
            disabled={pending}
            onChange={(certRequired) => form.change({ certRequired })}
          />
        </MobileFormSection>
        <MobileFormSection title="변경 사유">
          <Field.Root
            label="사유"
            htmlFor={`${ID_PREFIX}-reason`}
            required
            description="기본 정보와 인증 정책을 함께 저장하며, 사유는 활동 기록에 남습니다."
          >
            <TextInput
              id={`${ID_PREFIX}-reason`}
              value={form.reason}
              enterKeyHint="done"
              placeholder="변경한 이유를 적어 주세요"
              onChange={(event) => form.setReason(event.target.value)}
            />
          </Field.Root>
        </MobileFormSection>
      </VStack>
      <MobileActionBar elevated={false}>
        <HStack gap="100">
          {rulebook.hidden ? (
            <Button
              variant="outline"
              colorPalette="gray"
              disabled={!form.hasReason || pending}
              loading={form.unhiding.pending}
              onClick={() => void form.unhide()}
              className="min-h-12 flex-1"
            >
              숨김 해제
            </Button>
          ) : (
            <Button
              variant="outline"
              colorPalette="gray"
              disabled={pending}
              onClick={() => form.setHiding(true)}
              className="min-h-12 flex-1"
            >
              숨김 처리
            </Button>
          )}
          <Button
            loading={form.checking || (form.saving.pending && !form.dialogOpen)}
            disabled={!form.canSave}
            onClick={form.save}
            className="min-h-12 flex-1"
          >
            저장
          </Button>
        </HStack>
      </MobileActionBar>
      <RulebookEditDialogs rulebook={rulebook} viewerId={viewerId} form={form} />
    </>
  );
}
