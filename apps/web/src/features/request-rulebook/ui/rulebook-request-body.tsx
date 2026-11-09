"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Button, Field, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

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
  const [activeId, setActiveId] = useState("first");
  const [errors, setErrors] = useState<RequestItemError[]>([]);
  const [submitError, setSubmitError] = useState("");
  const editorRoot = useRef<HTMLDivElement>(null);
  const { pending, run } = useAction();
  const active = drafts.find((draft) => draft.clientId === activeId)!;
  const activeIndex = drafts.findIndex((draft) => draft.clientId === activeId);
  const duplicates = duplicateRequestErrors(drafts, pendingRequestNames);
  const allErrors = [...errors, ...duplicates];
  const activeError = allErrors.find((error) => error.clientId === activeId)?.message;

  const selectBook = (id: string) => {
    setActiveId(id);
    editorRoot.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  const showErrors = (itemErrors: RequestItemError[], message: string) => {
    setErrors(itemErrors);
    setSubmitError(message);
    const first = drafts.find((draft) =>
      itemErrors.some((error) => error.clientId === draft.clientId),
    );
    if (first) {
      selectBook(first.clientId);
      editorRoot.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    }
  };
  const changeActive = (patch: Partial<Omit<RequestDraft, "clientId">>) => {
    setDrafts((current) =>
      current.map((draft) => (draft.clientId === activeId ? { ...draft, ...patch } : draft)),
    );
    setErrors((current) => current.filter((error) => error.clientId !== activeId));
    setSubmitError("");
  };
  const addBook = () => {
    if (pending || drafts.length >= RULEBOOK_REQUEST_MAX_BOOKS) return;
    const parsed = rulebookRequestSchema.safeParse(active);
    const error = parsed.success
      ? duplicates.find((entry) => entry.clientId === activeId)?.message
      : parsed.error.issues[0]?.message;
    if (error) {
      showErrors(
        [{ clientId: activeId, message: error }],
        "작성 중인 룰북 정보를 먼저 확인해 주세요.",
      );
      return;
    }
    const draft = newRequestDraft(crypto.randomUUID());
    setDrafts((current) => [...current, draft]);
    setSubmitError("");
    selectBook(draft.clientId);
    editorRoot.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
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
          <VStack gap="175">
            <Text typography="subtitle1" render={<h2 />}>
              {activeIndex + 1}번째 룰북
            </Text>
            <Field.Root label="룰북 이름" htmlFor="request-book-name" required>
              <TextInput
                id="request-book-name"
                placeholder="예: 크툴루 나우"
                maxLength={100}
                value={active.name}
                invalid={Boolean(activeError && !active.name.trim())}
                onChange={(event) => changeActive({ name: event.target.value })}
              />
            </Field.Root>
            <RequestDetailFields
              key={activeId}
              id="request-book"
              value={active}
              categoryNames={categoryNames}
              onChange={changeActive}
            />
            {activeError && (
              <Text
                id="request-book-error"
                role="alert"
                typography="body4"
                foreground="danger"
                render={<p />}
              >
                {activeError}
              </Text>
            )}
            <Text typography="body4" foreground="muted">
              정확히 모르는 정보는 비워 두셔도 괜찮아요.
            </Text>
          </VStack>
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
            <Text
              typography="body4"
              foreground="muted"
              render={<p />}
              className="mt-125 break-keep"
            >
              작성한 내용은 목록에 보관됩니다. 다른 책의 정보를 이어서 입력할 수 있어요.
            </Text>
          </div>
        </VStack>
      </fieldset>
    </div>
  );
  const list = (
    <RequestBookList
      drafts={drafts}
      activeId={activeId}
      errors={allErrors}
      pending={pending}
      submitError={submitError}
      onSelect={selectBook}
      onRemove={(id) => {
        if (pending || drafts.length === 1) return;
        const remaining = drafts.filter((draft) => draft.clientId !== id);
        setDrafts(remaining);
        setErrors((current) => current.filter((error) => error.clientId !== id));
        setSubmitError("");
        if (id === activeId) selectBook(remaining[0]!.clientId);
      }}
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
