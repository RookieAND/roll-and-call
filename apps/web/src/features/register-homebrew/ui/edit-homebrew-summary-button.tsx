"use client";

import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { Button, Field, Grid, IconButton, Sheet, TextInput } from "@roll-and-call/ui";
import { PenLine } from "lucide-react";
import { useState } from "react";

import { useAction } from "@/shared/ui";

import { saveHomebrewSummary } from "../api/save-homebrew-summary";

interface EditHomebrewSummaryButtonProps {
  applicationId: string;
  summary: string;
}

export function EditHomebrewSummaryButton({
  applicationId,
  summary,
}: EditHomebrewSummaryButtonProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(summary);
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useAction();

  function openSheet() {
    setDraft(summary);
    setError(null);
    setOpen(true);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    run(() => saveHomebrewSummary({ applicationId, summary: draft }), {
      onSuccess: () => setOpen(false),
      onError: (result) => setError(result.error),
    });
  }

  return (
    <>
      <IconButton variant="ghost" size="lg" aria-label="한 줄 소개 수정" onClick={openSheet}>
        <PenLine size={20} aria-hidden />
      </IconButton>
      <Sheet.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <Sheet.Popup aria-label="한 줄 소개 수정">
          <Sheet.Handle />
          <form onSubmit={save}>
            <Sheet.Title>한 줄 소개 수정</Sheet.Title>
            <Sheet.Body className="py-200">
              <Field.Root
                label="한 줄 소개"
                htmlFor="homebrewSummaryEdit"
                required
                counter={`${draft.length} / ${HOMEBREW_LIMIT.summaryLength}`}
                error={error ?? undefined}
              >
                <TextInput
                  id="homebrewSummaryEdit"
                  placeholder="어떤 룰인지 한 줄로 적어 주세요"
                  maxLength={HOMEBREW_LIMIT.summaryLength}
                  value={draft}
                  invalid={Boolean(error)}
                  onChange={(event) => {
                    setError(null);
                    setDraft(event.target.value);
                  }}
                />
              </Field.Root>
            </Sheet.Body>
            <Sheet.Footer className="border-t border-gray-200">
              <Grid cols={2} gap="100">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" size="lg" loading={pending} disabled={!draft.trim()}>
                  저장
                </Button>
              </Grid>
            </Sheet.Footer>
          </form>
        </Sheet.Popup>
      </Sheet.Root>
    </>
  );
}
