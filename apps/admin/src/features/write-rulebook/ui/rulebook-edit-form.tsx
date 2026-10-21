"use client";

import { Button, Field, HStack, TextInput, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { RulebookDetail } from "@/entities/rulebook/server";
import { ActionNetworkError, Panel } from "@/shared/ui";

import { useRulebookEditForm } from "../model/use-rulebook-edit-form";
import { BasicInfoFields } from "./basic-info-fields";
import { CertPolicyField } from "./cert-policy-field";
import { CoveredBooksField } from "./covered-books-field";
import { KindCards } from "./kind-cards";
import { MiniRuleField } from "./mini-rule-field";
import { RulebookEditDialogs } from "./rulebook-edit-dialogs";

interface RulebookEditFormProps {
  rulebook: RulebookDetail;
  viewerId: string;
  aside: ReactNode;
}

export function RulebookEditForm({ rulebook, viewerId, aside }: RulebookEditFormProps) {
  const form = useRulebookEditForm({ rulebook, viewerId });
  const { draft, pending } = form;

  return (
    <VStack data-full-bleed className="min-h-0 flex-1">
      <div className="mx-auto grid w-full max-w-page flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
        <VStack gap="200" className="min-w-0">
          {(form.saving.networkError && !form.dialogOpen) || form.unhiding.networkError ? (
            <ActionNetworkError />
          ) : null}
          <Panel title="기본 정보" bodyClassName="p-175">
            <BasicInfoFields
              draft={draft}
              categories={form.categories}
              idPrefix="rulebook"
              categoryHelp={form.categoryHint}
              categoryError={form.category.error}
              nameError={form.nameError}
              disabled={pending}
              onChange={form.change}
            >
              <VStack gap="175" className="border-t border-(--rc-color-border-subtle) pt-175">
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
              </VStack>
            </BasicInfoFields>
          </Panel>
          <Panel title="인증 정책" bodyClassName="p-175">
            <CertPolicyField
              certRequired={draft.certRequired}
              disabled={pending}
              onChange={(certRequired) => form.change({ certRequired })}
            />
          </Panel>
          <Panel title="함께 인증되는 책" bodyClassName="p-175">
            <CoveredBooksField
              draft={draft}
              category={form.category}
              disabled={pending}
              onChange={form.change}
            />
          </Panel>
          <Panel title="미니룰" bodyClassName="p-175">
            <MiniRuleField
              miniRule={form.miniRule}
              disabled={pending || !form.miniRuleEditable}
              onChange={form.setMiniRule}
            />
          </Panel>
        </VStack>
        {aside}
      </div>
      <HStack
        align="end"
        gap="125"
        className="sticky bottom-0 border-t border-gray-200 bg-surface px-page py-150"
      >
        <Field.Root label="변경 사유" htmlFor="rulebook-reason" required className="flex-1">
          <TextInput
            id="rulebook-reason"
            value={form.reason}
            placeholder="기본 정보와 인증 정책을 함께 저장하며, 사유는 활동 기록에 남습니다"
            onChange={(event) => form.setReason(event.target.value)}
          />
        </Field.Root>
        {rulebook.hidden ? (
          <Button
            variant="outline"
            colorPalette="gray"
            disabled={!form.hasReason || pending}
            loading={form.unhiding.pending}
            onClick={() => void form.unhide()}
          >
            숨김 해제
          </Button>
        ) : (
          <Button
            variant="outline"
            colorPalette="danger"
            disabled={pending}
            onClick={() => form.setHiding(true)}
          >
            숨김 처리
          </Button>
        )}
        <Button
          loading={form.checking || (form.saving.pending && !form.dialogOpen)}
          disabled={!form.canSave}
          onClick={form.save}
          className="min-w-[96px]"
        >
          저장
        </Button>
      </HStack>
      <RulebookEditDialogs rulebook={rulebook} viewerId={viewerId} form={form} />
    </VStack>
  );
}
