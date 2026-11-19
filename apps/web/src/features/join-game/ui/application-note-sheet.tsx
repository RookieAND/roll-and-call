"use client";

import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";
import { Button, Callout, Field, HStack, Sheet, Text, Textarea } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState, type ReactNode } from "react";

import { GmQuestion } from "./gm-question";

interface ApplicationNoteSheetProps {
  open: boolean;
  // 신청글을 받지 않는 구인이면 null이다. 입력 칸 없이 요약과 버튼만 보인다.
  question: string | null;
  // 다회차 구인의 일정 요약 카드. 있으면 제목이 「신청하기」가 된다.
  summary?: ReactNode;
  onOpenChange: (open: boolean) => void;
  submitLabel: string;
  pending: boolean;
  failed: boolean;
  onSubmit: (note?: string) => void;
}

export function ApplicationNoteSheet({
  open,
  question,
  summary,
  onOpenChange,
  submitLabel,
  pending,
  failed,
  onSubmit,
}: ApplicationNoteSheetProps) {
  const [note, setNote] = useState("");
  const hasNote = !isNull(question);
  const canSubmit = !hasNote || note.trim().length > 0;
  const submittedNote = hasNote ? note : undefined;
  const title = summary ? "신청하기" : "신청글 쓰기";

  function changeOpen(next: boolean) {
    if (!next) setNote("");
    onOpenChange(next);
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Popup className="gap-150">
        <Sheet.Handle />
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>{title}</Sheet.Title>
        {summary}
        {hasNote && (
          <>
            <GmQuestion question={question} />
            <Field.Root
              htmlFor="applicationNote"
              counter={`${note.length} / ${APPLICATION_NOTE_MAX_LENGTH}`}
            >
              <Textarea
                id="applicationNote"
                aria-label="신청글"
                autoComplete="off"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="질문에 대한 답을 적어 주세요."
                maxLength={APPLICATION_NOTE_MAX_LENGTH}
                rows={5}
                disabled={pending}
              />
            </Field.Root>
          </>
        )}
        {failed && (
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              신청하지 못했습니다.
              <br />
              입력한 내용은 그대로 있습니다.
            </Callout.Description>
            <Callout.Action>
              <Button
                variant="solid"
                colorPalette="danger"
                size="sm"
                className="min-h-[44px]"
                disabled={pending || !canSubmit}
                onClick={() => onSubmit(submittedNote)}
              >
                다시 시도
              </Button>
            </Callout.Action>
          </Callout.Root>
        )}
        <HStack gap="100">
          <Button
            variant="outline"
            colorPalette="gray"
            size="lg"
            className="flex-1"
            disabled={pending}
            onClick={() => changeOpen(false)}
          >
            취소
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!canSubmit}
            loading={pending}
            onClick={() => onSubmit(submittedNote)}
          >
            {submitLabel}
          </Button>
        </HStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
