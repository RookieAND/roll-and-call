"use client";

import { Button, Container, FloatingBar, Progress, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useEffect, useRef, useState } from "react";

import { certApplyHref, type MyRulebook } from "@/entities/rulebook";
import { useServerPath } from "@/shared/lib";
import { AppBar, toast, useAction } from "@/shared/ui";

import { submitCertificationGroup } from "../api/submit-certification-group";
import { bulkDraftMissing } from "../model/bulk-draft-missing";
import { bulkFormHint } from "../model/bulk-form-hint";
import { bulkPhotoKeys } from "../model/bulk-photo-keys";
import { bulkQuizFieldRulebookId } from "../model/bulk-quiz-field";
import { bulkQuizMissing } from "../model/bulk-quiz-missing";
import { emptyBulkDraft } from "../model/empty-bulk-draft";
import { revokePreview } from "../model/photo-slot";
import { BulkBookList } from "./bulk-book-list";
import { BulkPhotoStep } from "./bulk-photo-step";
import { BulkQuizStep, type BulkQuiz } from "./bulk-quiz-step";

interface BulkCertApplyFormProps {
  serverId: string;
  rulebooks: MyRulebook[];
  nickname: string;
  quizzes: BulkQuiz[];
}

export function BulkCertApplyForm({
  serverId,
  rulebooks,
  nickname,
  quizzes,
}: BulkCertApplyFormProps) {
  const toServerPath = useServerPath();
  const [draft, setDraft] = useState(emptyBulkDraft);
  const latestDraft = useRef(draft);
  useEffect(() => {
    latestDraft.current = draft;
  }, [draft]);
  useEffect(() => () => latestDraft.current.photos.forEach(revokePreview), []);
  const [onQuiz, setOnQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizErrors, setQuizErrors] = useState<Record<string, string>>({});
  const { pending, run } = useAction();

  const rulebookIds = rulebooks.map((rulebook) => rulebook.id);
  const hasQuiz = quizzes.length > 0;
  const totalSteps = hasQuiz ? 3 : 2;
  const step = onQuiz ? 3 : 2;
  const photoMissing = bulkDraftMissing(draft);
  const quizMissing = bulkQuizMissing({
    rulebookIds: quizzes.map((quiz) => quiz.rulebookId),
    answers,
  });
  const hasQuizError = Object.keys(quizErrors).length > 0;
  const submitLabel = `${rulebooks.length}권 신청하기`;
  const hint = bulkFormHint({ onQuiz, photoMissing, quizMissing, hasQuizError });

  const submit = () =>
    run(
      () =>
        submitCertificationGroup({
          rulebookIds,
          photos: bulkPhotoKeys(draft),
          quizAnswers: answers,
        }),
      {
        onError: (result) => {
          const wrongBookId = bulkQuizFieldRulebookId(result.field);
          if (wrongBookId) setQuizErrors({ [wrongBookId]: result.error });
          else toast.danger(result.error);
        },
      },
    );

  return (
    <>
      <AppBar
        title="인증 신청"
        {...(onQuiz
          ? { onBack: () => setOnQuiz(false) }
          : { back: toServerPath(certApplyHref({ rulebookIds })) })}
        action={
          <Text typography="body4" foreground="hint" numeric className="px-100">
            {step} / {totalSteps}
          </Text>
        }
      />
      <Progress value={step} max={totalSteps} className="h-[3px] rounded-none" aria-label="진행" />

      <Container size="sm">
        <div className="pt-200 pb-250">
          {onQuiz ? (
            <BulkQuizStep
              quizzes={quizzes}
              totalBooks={rulebooks.length}
              answers={answers}
              errors={quizErrors}
              onAnswerChange={({ rulebookId, answer }) => {
                setAnswers((current) => ({ ...current, [rulebookId]: answer }));
                setQuizErrors({});
              }}
            />
          ) : (
            <VStack gap="250">
              <VStack gap="150">
                <VStack gap="050">
                  <Text typography="heading1" render={<h2 />}>
                    {`${rulebooks.length}권 함께 신청`}
                  </Text>
                  <Text typography="body3" foreground="muted" render={<p />} className="break-keep">
                    권마다 따로 심사하고, 결과도 권마다 알립니다.
                  </Text>
                </VStack>
                <BulkBookList books={rulebooks} />
              </VStack>
              <BulkPhotoStep
                serverId={serverId}
                nickname={nickname}
                draft={draft}
                update={setDraft}
              />
            </VStack>
          )}
        </div>
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
              {onQuiz || !hasQuiz ? (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isNull(photoMissing) || (onQuiz && !isNull(quizMissing))}
                  loading={pending}
                  onClick={submit}
                >
                  {submitLabel}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isNull(photoMissing)}
                  onClick={() => setOnQuiz(true)}
                >
                  다음
                </Button>
              )}
            </VStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
