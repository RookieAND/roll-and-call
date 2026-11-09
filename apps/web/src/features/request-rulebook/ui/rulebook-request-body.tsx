"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Button, Field, IconButton, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Plus, Trash2 } from "lucide-react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebooks } from "../api/request-rulebook";
import {
  duplicateRequestErrors,
  newRequestDraft,
  rulebookRequestsSchema,
  rulebookRequestSchema,
  type RequestDraft,
  type RequestItemError,
} from "../model/rulebook-request-form";
import { RequestBookList } from "./request-book-list";
import { RequestDetailFields } from "./request-detail-fields";

interface RulebookRequestBodyProps {
  categoryNames: string[];
  pendingRequestNames: string[];
  initialName: string;
  intro: ReactNode;
  onSent: () => void;
  submitRequests?: typeof requestRulebooks;
  renderLayout?: (content: { editor: ReactNode; list: ReactNode }) => ReactNode;
}

export function RulebookRequestBody({
  categoryNames,
  pendingRequestNames,
  initialName,
  intro,
  onSent,
  submitRequests = requestRulebooks,
  renderLayout,
}: RulebookRequestBodyProps) {
  const [drafts, setDrafts] = useState<RequestDraft[]>([newRequestDraft("first", initialName)]);
  const [errors, setErrors] = useState<RequestItemError[]>([]);
  const [submitError, setSubmitError] = useState("");
  const editorRoot = useRef<HTMLDivElement>(null);
  const addedBookId = useRef<string | null>(null);
  const { pending, run } = useAction();
  const duplicates = duplicateRequestErrors(drafts, pendingRequestNames);
  const allErrors = [...errors, ...duplicates];
  const navigateToBook = (id: string, focusInput = false) => {
    const section = editorRoot.current?.querySelector<HTMLElement>(`#request-book-${id}`);
    section?.scrollIntoView({ block: "start", behavior: "smooth" });
    if (focusInput)
      section?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    else section?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    if (!addedBookId.current) return;
    navigateToBook(addedBookId.current, true);
    addedBookId.current = null;
  }, [drafts.length]);
  const showErrors = (itemErrors: RequestItemError[], message: string) => {
    setErrors(itemErrors);
    setSubmitError(message);
    const first = drafts.find((draft) =>
      itemErrors.some((error) => error.clientId === draft.clientId),
    );
    if (first) {
      navigateToBook(first.clientId, true);
    }
  };
  const changeBook = (id: string, patch: Partial<Omit<RequestDraft, "clientId">>) => {
    setDrafts((current) =>
      current.map((draft) => (draft.clientId === id ? { ...draft, ...patch } : draft)),
    );
    // 한 책의 이름·판본을 고치면 다른 책의 중복 오류도 해소될 수 있다.
    setErrors([]);
    setSubmitError("");
  };
  const addBook = () => {
    if (pending || drafts.length >= RULEBOOK_REQUEST_MAX_BOOKS) return;
    for (const draft of drafts) {
      const parsed = rulebookRequestSchema.safeParse(draft);
      const error = parsed.success
        ? duplicates.find((entry) => entry.clientId === draft.clientId)?.message
        : parsed.error.issues[0]?.message;
      if (error) {
        showErrors(
          [{ clientId: draft.clientId, message: error }],
          "작성 중인 룰북 정보를 먼저 확인해 주세요.",
        );
        return;
      }
    }
    const draft = newRequestDraft(crypto.randomUUID());
    addedBookId.current = draft.clientId;
    setDrafts((current) => [...current, draft]);
    setSubmitError("");
  };
  const submit = () => {
    if (pending) return;
    const parsed = rulebookRequestsSchema.safeParse({ items: drafts });
    const validationErrors = parsed.success
      ? []
      : parsed.error.issues.flatMap((issue) => {
          const index = issue.path[1];
          const draft = typeof index === "number" ? drafts[index] : null;
          return draft ? [{ clientId: draft.clientId, message: issue.message }] : [];
        });
    const itemErrors = [...validationErrors, ...duplicates];
    if (!parsed.success || itemErrors.length) {
      showErrors(itemErrors, "표시된 룰북을 확인해 주세요. 아직 요청을 보내지 않았습니다.");
      return;
    }
    setErrors([]);
    setSubmitError("");
    run(() => submitRequests(parsed.data), {
      onSuccess: (result) => {
        toast.success(`${result.createdCount ?? drafts.length}권 추가 요청을 보냈습니다`);
        onSent();
      },
      onError: (result) => showErrors(result.itemErrors ?? [], result.error),
    });
  };

  const editor = (
    <div ref={editorRoot} className="scroll-mt-200">
      <fieldset disabled={pending} className="m-0 min-w-0 border-0 p-0">
        <VStack gap="250">
          {intro}
          {drafts.map((draft, index) => {
            const id = `request-book-${draft.clientId}`;
            const error = allErrors.find((entry) => entry.clientId === draft.clientId)?.message;
            return (
              <section
                key={draft.clientId}
                id={id}
                tabIndex={-1}
                aria-labelledby={`${id}-heading`}
                className="scroll-mt-[calc(var(--rc-size-appbar)+1rem)] border-t border-gray-100 pt-200 outline-none first-of-type:border-t-0 first-of-type:pt-0 desktop:scroll-mt-200"
              >
                <VStack gap="175">
                  <div className="flex items-center justify-between gap-100">
                    <Text id={`${id}-heading`} typography="subtitle1" render={<h2 />}>
                      {index + 1}번째 룰북
                    </Text>
                    {drafts.length > 1 && (
                      <IconButton
                        size="sm"
                        aria-label={`${index + 1}번째 룰북 삭제`}
                        onClick={() => {
                          setDrafts((current) =>
                            current.filter((book) => book.clientId !== draft.clientId),
                          );
                          setErrors([]);
                          setSubmitError("");
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                  </div>
                  <Field.Root label="룰북 이름" htmlFor={`${id}-name`} required>
                    <TextInput
                      id={`${id}-name`}
                      placeholder="예: 크툴루 나우"
                      maxLength={100}
                      value={draft.name}
                      invalid={Boolean(error && !draft.name.trim())}
                      onChange={(event) => changeBook(draft.clientId, { name: event.target.value })}
                    />
                  </Field.Root>
                  <RequestDetailFields
                    id={id}
                    value={draft}
                    categoryNames={categoryNames}
                    onChange={(patch) => changeBook(draft.clientId, patch)}
                  />
                  {error && (
                    <Text
                      id={`${id}-error`}
                      role="alert"
                      typography="body4"
                      foreground="danger"
                      render={<p />}
                    >
                      {error}
                    </Text>
                  )}
                  <Text typography="body4" foreground="muted">
                    정확히 모르는 정보는 비워 두셔도 괜찮아요.
                  </Text>
                </VStack>
              </section>
            );
          })}
          <div className="border-t border-gray-100 pt-200">
            <Button
              variant="outline"
              className="w-full"
              disabled={drafts.length >= RULEBOOK_REQUEST_MAX_BOOKS}
              onClick={addBook}
            >
              <Plus size={18} />
              다음 룰북 작성
            </Button>
          </div>
        </VStack>
      </fieldset>
    </div>
  );
  const list = (
    <RequestBookList
      drafts={drafts}
      errors={allErrors}
      pending={pending}
      submitError={submitError}
      onNavigate={navigateToBook}
      onSubmit={submit}
    />
  );

  return renderLayout ? (
    renderLayout({ editor, list })
  ) : (
    <VStack gap="250">
      {editor}
      {list}
    </VStack>
  );
}
