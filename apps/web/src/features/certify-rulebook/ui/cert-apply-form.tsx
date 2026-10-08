"use client";

import { Button, Callout, Container, FloatingBar, Progress, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { certApplyHref, type MyRulebook } from "@/entities/rulebook";
import { useServerPath } from "@/shared/lib";
import { TRIAL_HANDLER, useIsTrial, useTrialHandler } from "@/shared/trial";
import { AppBar, LineBreaks, toast, useAction } from "@/shared/ui";

import { submitCertification } from "../api/submit-certification";
import { toCertEntry } from "../model/cert-entry";
import { draftMissing } from "../model/draft-missing";
import { initialDraft } from "../model/initial-draft";
import { revokePreview } from "../model/photo-slot";
import { QUIZ_ANSWER_FIELD } from "../model/quiz-answer-field";
import { BookDraftCard } from "./book-draft-card";
import { quizHintText } from "./quiz-hint-text";
import { QuizStep } from "./quiz-step";

interface CertApplyFormProps {
  serverId: string;
  rulebook: MyRulebook;
  nickname: string;
  sellers: string[];
  quiz: { id: string; question: string } | null;
  rejection: { title: string; lines: string[] } | null;
  previews: Record<string, string>;
  // 앱바 바로 아래에 붙는 줄. 체험 환경의 「체험 중」 표시가 쓴다.
  belowAppBar?: ReactNode;
}

export function CertApplyForm({
  serverId,
  rulebook,
  nickname,
  sellers,
  quiz,
  rejection,
  previews,
  belowAppBar,
}: CertApplyFormProps) {
  const trial = useIsTrial();
  const submitAction = useTrialHandler(TRIAL_HANDLER.submitCertification, submitCertification);
  const toServerPath = useServerPath();
  const [draft, setDraft] = useState(() => initialDraft({ rulebook, sellers, previews }));
  const latestDraft = useRef(draft);
  useEffect(() => {
    latestDraft.current = draft;
  }, [draft]);
  useEffect(
    () => () =>
      [
        ...Object.values(latestDraft.current.shots),
        ...Object.values(latestDraft.current.proofs),
      ].forEach(revokePreview),
    [],
  );
  const [onQuiz, setOnQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  const [quizError, setQuizError] = useState<string | null>(null);
  const { pending, run } = useAction();
  const retry = !isNull(rejection);
  const missing = draftMissing(draft);
  const totalSteps = quiz ? 3 : 2;
  const step = onQuiz ? 3 : 2;
  const submitLabel = retry ? "다시 신청하기" : "신청하기";

  const submit = () =>
    run(
      () =>
        submitAction({
          entry: toCertEntry({ rulebookId: rulebook.id, draft }),
          quiz: quiz ? { questionId: quiz.id, answer } : null,
        }),
      {
        onError: (result) =>
          result.field === QUIZ_ANSWER_FIELD
            ? setQuizError(result.error)
            : toast.danger(result.error),
      },
    );

  const photoHint = missing ?? "";
  const quizHint = quizHintText({ quizError, answer });

  return (
    <>
      <AppBar
        title={retry ? "다시 신청" : "인증 신청"}
        {...(onQuiz
          ? { onBack: () => setOnQuiz(false) }
          : {
              back: toServerPath(
                retry
                  ? `/me/rulebooks/${rulebook.id}`
                  : certApplyHref({ rulebookIds: [rulebook.id] }),
              ),
            })}
        action={
          retry || trial ? undefined : (
            <Text typography="body4" foreground="hint" numeric className="px-100">
              {step} / {totalSteps}
            </Text>
          )
        }
      />
      {belowAppBar}
      {!retry && !trial && (
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
              bookTitle={rulebook.shortName}
              bookSub={`${rulebook.categoryName} ${rulebook.edition}`.trim()}
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
              serverId={serverId}
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
                  disabled={!isNull(missing) || (onQuiz && !answer.trim())}
                  loading={pending}
                  onClick={submit}
                >
                  {submitLabel}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!isNull(missing)}
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
