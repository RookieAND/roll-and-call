"use client";

import { Button, Chip, Container, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { Circle, CircleCheck } from "lucide-react";
import { useState } from "react";

import type { MyRulebook } from "@/entities/rulebook";
import { useAction } from "@/shared/ui";

import { submitCertification } from "../api/submit-certification";
import { applyHint } from "../model/apply-hint";
import type { BookDraft } from "../model/book-draft";
import { toCertEntry } from "../model/cert-entry";
import { draftMissing } from "../model/draft-missing";
import { initialDraft } from "../model/initial-draft";
import { BookDraftCard } from "./book-draft-card";

interface CertApplyFormProps {
  rulebooks: MyRulebook[];
  nickname: string;
  // 반려된 책 한 권을 다시 낼 때. 버튼 문구와 빈 칸 표시가 바뀐다.
  retry: boolean;
}

// 신청 2단계. 책 한 권씩 탭으로 넘기며 채우고, 모두 채우면 한 번에 낸다.
export function CertApplyForm({ rulebooks, nickname, retry }: CertApplyFormProps) {
  const [drafts, setDrafts] = useState<Record<string, BookDraft>>(() =>
    Object.fromEntries(rulebooks.map((rulebook) => [rulebook.id, initialDraft(rulebook)])),
  );
  const [currentId, setCurrentId] = useState(rulebooks[0]!.id);
  const { pending, run } = useAction();

  const current = rulebooks.find((rulebook) => rulebook.id === currentId) ?? rulebooks[0]!;
  const draftList = rulebooks.map((rulebook) => drafts[rulebook.id]!);
  const { ready, hint } = applyHint(draftList);
  const multiple = rulebooks.length > 1;
  const cta = retry ? "다시 신청하기" : multiple ? `${rulebooks.length}권 신청하기` : "신청하기";

  const update = (rulebookId: string) => (updater: (draft: BookDraft) => BookDraft) =>
    setDrafts((previous) => ({ ...previous, [rulebookId]: updater(previous[rulebookId]!) }));

  const submit = () =>
    run(() =>
      submitCertification(
        rulebooks.map((rulebook) => toCertEntry(rulebook.id, drafts[rulebook.id]!)),
      ),
    );

  return (
    <>
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-250">
          {multiple && (
            <HStack role="tablist" aria-label="신청할 책" gap="100">
              {rulebooks.map((rulebook) => {
                const done = draftMissing(drafts[rulebook.id]!) === null;
                const Icon = done ? CircleCheck : Circle;
                const selected = rulebook.id === current.id;
                return (
                  <Chip
                    key={rulebook.id}
                    role="tab"
                    aria-selected={selected}
                    shape="block"
                    selected={selected}
                    onClick={() => setCurrentId(rulebook.id)}
                    className="min-w-0"
                  >
                    <Icon
                      size={16}
                      strokeWidth={2.2}
                      aria-hidden
                      className={done ? "text-success-700" : undefined}
                    />
                    <Text typography="body3" weight="bold" foreground="inherit" truncate>
                      {rulebook.shortName}
                    </Text>
                  </Chip>
                );
              })}
            </HStack>
          )}
          <BookDraftCard
            key={current.id}
            rulebook={current}
            draft={drafts[current.id]!}
            nickname={nickname}
            highlightEmpty={retry}
            update={update(current.id)}
          />
        </VStack>
      </Container>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <VStack gap="100">
              {hint && (
                <Text typography="body4" weight="medium" foreground="muted" className="text-center">
                  {hint}
                </Text>
              )}
              <Button
                size="lg"
                className="w-full"
                disabled={!ready}
                loading={pending}
                onClick={submit}
              >
                {cta}
              </Button>
            </VStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
