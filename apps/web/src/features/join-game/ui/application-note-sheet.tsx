"use client";

import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";
import { Button, Callout, Field, HStack, Sheet, Text, Textarea } from "@roll-and-call/ui";
import { useState } from "react";

interface ApplicationNoteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitLabel: string;
  pending: boolean;
  failed: boolean;
  onSubmit: (note: string) => void;
}

export function ApplicationNoteSheet({
  open,
  onOpenChange,
  submitLabel,
  pending,
  failed,
  onSubmit,
}: ApplicationNoteSheetProps) {
  const [note, setNote] = useState("");
  const canSubmit = note.trim().length > 0;

  function changeOpen(next: boolean) {
    if (!next) setNote("");
    onOpenChange(next);
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Popup className="gap-150">
        <Sheet.Handle />
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>
          신청글 쓰기
        </Sheet.Title>
        <Field.Root
          htmlFor="applicationNote"
          counter={`${note.length} / ${APPLICATION_NOTE_MAX_LENGTH}`}
        >
          <Textarea
            id="applicationNote"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="GM에게 전할 내용을 적어 주세요."
            maxLength={APPLICATION_NOTE_MAX_LENGTH}
            rows={5}
            disabled={pending}
          />
        </Field.Root>
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
                variant="outline"
                colorPalette="danger"
                size="sm"
                className="min-h-[44px]"
                disabled={pending || !canSubmit}
                onClick={() => onSubmit(note)}
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
            onClick={() => onSubmit(note)}
          >
            {submitLabel}
          </Button>
        </HStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
