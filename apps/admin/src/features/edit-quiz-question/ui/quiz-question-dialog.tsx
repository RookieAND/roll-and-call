"use client";

import {
  Badge,
  Button,
  Callout,
  Dialog,
  Field,
  HStack,
  Text,
  TextInput,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useState, useTransition } from "react";

import type { QuizQuestion } from "@/shared/server";

import { submitQuizQuestion } from "../api/submit-quiz-question";
import { addAnswer } from "../model/add-answer";

interface QuizQuestionDialogProps {
  rulebookId: string;
  // null이면 새 문항을 추가한다.
  question: QuizQuestion | null;
  open: boolean;
  onClose: () => void;
}

// 본문 퀴즈 문항 추가·수정. 수정 창에는 비활성화(또는 다시 사용)가 붙는다.
export function QuizQuestionDialog({
  rulebookId,
  question,
  open,
  onClose,
}: QuizQuestionDialogProps) {
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(question?.question ?? "");
  const [answers, setAnswers] = useState(question?.answers ?? []);
  const [answerInput, setAnswerInput] = useState("");
  const [page, setPage] = useState(question?.page ?? "");
  const editing = question !== null;
  const withPendingAnswer = addAnswer(answers, answerInput);
  const canSave = Boolean(text.trim()) && withPendingAnswer.length > 0 && !pending;

  const save = (active: boolean, message: string) =>
    startTransition(async () => {
      await submitQuizQuestion(rulebookId, question?.id ?? null, {
        question: text,
        answers: withPendingAnswer,
        page,
        active,
      });
      toast.success(message);
      onClose();
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => nextOpen || pending || onClose()}>
      <Dialog.Popup className="max-w-[600px]">
        <Dialog.Header>
          <Dialog.Title>본문 퀴즈 문항 {editing ? "수정" : "추가"}</Dialog.Title>
          <Dialog.Description>
            책을 가진 사람이 쉽게 답할 수 있는 질문으로 적어 주세요.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            <Field.Root label="질문" htmlFor="quiz-question" required>
              <Textarea
                id="quiz-question"
                rows={2}
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </Field.Root>
            <Field.Root
              label="허용하는 답"
              htmlFor="quiz-answer"
              required
              description="표기가 다른 답을 모두 등록합니다. 공백과 대소문자는 무시합니다."
            >
              <HStack
                align="center"
                gap="075"
                wrap
                className="min-h-11 rounded-400 border border-gray-200 px-125 py-100 focus-within:outline-2 focus-within:outline-(--rc-color-border-primary-strong)"
              >
                {answers.map((answer) => (
                  <Badge key={answer} className="gap-025">
                    {answer}
                    <button
                      type="button"
                      aria-label={`${answer} 삭제`}
                      onClick={() => setAnswers(answers.filter((item) => item !== answer))}
                      className="inline-flex text-hint"
                    >
                      <X size={12} aria-hidden />
                    </button>
                  </Badge>
                ))}
                <input
                  id="quiz-answer"
                  value={answerInput}
                  placeholder="답을 입력하고 Enter를 누릅니다"
                  onChange={(event) => setAnswerInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
                    event.preventDefault();
                    setAnswers(withPendingAnswer);
                    setAnswerInput("");
                  }}
                  className="min-w-[200px] flex-1 bg-transparent text-body3 outline-none placeholder:text-hint"
                />
              </HStack>
            </Field.Root>
            <Field.Root
              label="참고 쪽수 (운영진만 봄)"
              htmlFor="quiz-page"
              className="max-w-[200px]"
            >
              <TextInput
                id="quiz-page"
                placeholder="예: 31쪽"
                value={page}
                onChange={(event) => setPage(event.target.value)}
              />
            </Field.Root>
            <Callout.Root>
              <Callout.Icon />
              <Callout.Description>
                틀리면 같은 문항에 다시 답하고, 재신청하면 문항을 새로 뽑습니다.
              </Callout.Description>
            </Callout.Root>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center">
          {editing ? (
            <Button
              variant="outline"
              colorPalette={question.active ? "danger" : "gray"}
              disabled={!canSave}
              onClick={() =>
                save(
                  !question.active,
                  question.active ? "문항을 비활성화했습니다" : "문항을 다시 사용합니다",
                )
              }
              className="mr-auto"
            >
              {question.active ? "비활성화" : "다시 사용"}
            </Button>
          ) : (
            <Text typography="body4" foreground="hint" className="mr-auto">
              다음 신청부터 출제됩니다
            </Text>
          )}
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button
            loading={pending}
            disabled={!canSave}
            onClick={() =>
              save(
                question?.active ?? true,
                editing ? "문항을 저장했습니다" : "문항을 추가했습니다",
              )
            }
          >
            {editing ? "저장" : "추가"}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
