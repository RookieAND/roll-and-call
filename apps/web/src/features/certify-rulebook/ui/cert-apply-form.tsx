"use client";

import { Button, Callout, Container, FloatingBar, Progress, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { certApplyHref, type MyRulebook } from "@/entities/rulebook";
import { AppBar, LineBreaks, toast, useAction } from "@/shared/ui";

import { submitCertification } from "../api/submit-certification";
import { toCertEntry } from "../model/cert-entry";
import { draftMissing } from "../model/draft-missing";
import { initialDraft } from "../model/initial-draft";
import { QUIZ_ANSWER_FIELD } from "../model/quiz-answer-field";
import { BookDraftCard } from "./book-draft-card";
import { QuizStep } from "./quiz-step";

interface CertApplyFormProps {
  rulebook: MyRulebook;
  nickname: string;
  sellers: string[];
  // 사용 중인 본문 퀴즈가 있으면 3단계로 한 문항을 낸다.
  quiz: { id: string; question: string } | null;
  // 반려된 책을 다시 낼 때 위에 고정하는 반려 사유. 있으면 재신청 화면이다.
  rejection: { title: string; lines: string[] } | null;
}

// 신청 2단계(사진)와 3단계(퀴즈). 퀴즈가 틀리면 신청되지 않고 같은 문항에 다시 답한다.
export function CertApplyForm({
  rulebook,
  nickname,
  sellers,
  quiz,
  rejection,
}: CertApplyFormProps) {
  const [draft, setDraft] = useState(() => initialDraft({ rulebook, sellers }));
  const [onQuiz, setOnQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  const [quizError, setQuizError] = useState<string | null>(null);
  const { pending, run } = useAction();
  const retry = rejection !== null;
  const missing = draftMissing(draft);
  const totalSteps = quiz ? 3 : 2;
  const step = onQuiz ? 3 : 2;
  const submitLabel = retry ? "다시 신청하기" : "신청하기";

  const submit = () =>
    run(
      () =>
        submitCertification({
          entry: toCertEntry({ rulebookId: rulebook.id, draft }),
          quiz: quiz ? { questionId: quiz.id, answer } : null,
        }),
      {
        onError: (result) =>
          result.field === QUIZ_ANSWER_FIELD
            ? setQuizError(result.error)
            : toast.error(result.error),
      },
    );

  const photoHint = missing ?? "";
  const quizHint = quizError
    ? "답을 고친 뒤 다시 신청해 주세요"
    : answer.trim()
      ? ""
      : "답을 적으면 신청할 수 있습니다";

  return (
    <>
      <AppBar
        title={retry ? "다시 신청" : "인증 신청"}
        {...(onQuiz
          ? { onBack: () => setOnQuiz(false) }
          : {
              back: retry ? `/me/rulebooks/${rulebook.id}` : certApplyHref([rulebook.id]),
            })}
        action={
          retry ? undefined : (
            <Text typography="body4" foreground="hint" numeric className="px-100">
              {step} / {totalSteps}
            </Text>
          )
        }
      />
      {!retry && (
        <Progress
          value={step}
          max={totalSteps}
          className="h-[3px] rounded-none"
          aria-label="진행"
        />
      )}
      {rejection && !onQuiz && (
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) border-b border-gray-100 bg-surface px-200 py-150">
          <Callout.Root colorPalette="danger">
            <Callout.Icon />
            <Callout.Title>{rejection.title}</Callout.Title>
            {rejection.lines.length > 0 && (
              <Callout.Description className="break-keep">
                <LineBreaks lines={rejection.lines} />
              </Callout.Description>
            )}
          </Callout.Root>
        </div>
      )}

      <Container size="sm">
        <div className="pt-200 pb-250">
          {onQuiz && quiz ? (
            <QuizStep
              bookLabel={rulebook.label}
              question={quiz.question}
              answer={answer}
              error={quizError}
              onAnswerChange={(value) => {
                setAnswer(value);
                setQuizError(null);
              }}
            />
          ) : (
            <BookDraftCard
              rulebook={rulebook}
              draft={draft}
              nickname={nickname}
              sellers={sellers}
              highlightEmpty={retry}
              update={setDraft}
            />
          )}
        </div>
      </Container>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <VStack gap="100">
              {(onQuiz ? quizHint : photoHint) && (
                <Text typography="body4" weight="medium" foreground="muted" className="text-center">
                  {onQuiz ? quizHint : photoHint}
                </Text>
              )}
              {onQuiz || !quiz ? (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={missing !== null || (onQuiz && !answer.trim())}
                  loading={pending}
                  onClick={submit}
                >
                  {submitLabel}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={missing !== null}
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
