"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
import { Badge, Button, Callout, Field, Text, Textarea, VStack } from "@roll-and-call/ui";
import { BookPlus, ClipboardPaste, Plus, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebooks } from "../api/request-rulebook";
import {
  duplicateRequestErrors,
  EMPTY_REQUEST_DEFAULTS,
  requestNamesFromText,
  resolveRequestDraft,
  rulebookRequestsSchema,
  type RequestDefaults,
  type RequestDraft,
  type RequestItemError,
} from "../model/rulebook-request-form";
import { RequestBookCard } from "./request-book-card";
import { RequestDetailFields } from "./request-detail-fields";

interface RulebookRequestBodyProps {
  categoryNames: string[];
  pendingRequestNames: string[];
  initialName: string;
  intro: ReactNode;
  onSent: () => void;
  submitRequests?: typeof requestRulebooks;
  renderFooter: (footer: {
    submit: () => void;
    pending: boolean;
    disabled: boolean;
    count: number;
  }) => ReactNode;
}

export function RulebookRequestBody({
  categoryNames,
  pendingRequestNames,
  initialName,
  intro,
  onSent,
  renderFooter,
  submitRequests = requestRulebooks,
}: RulebookRequestBodyProps) {
  const [defaults, setDefaults] = useState<RequestDefaults>(EMPTY_REQUEST_DEFAULTS);
  const [drafts, setDrafts] = useState<RequestDraft[]>([
    { clientId: "first", name: initialName, overrides: {} },
  ]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [errors, setErrors] = useState<RequestItemError[]>([]);
  const [submitError, setSubmitError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const { pending, run } = useAction();
  const items = drafts.map((draft) => resolveRequestDraft(draft, defaults));
  const duplicates = duplicateRequestErrors(items, pendingRequestNames);
  const atLimit = drafts.length >= RULEBOOK_REQUEST_MAX_BOOKS;

  const clearErrors = () => {
    setErrors([]);
    setSubmitError("");
  };
  const focusError = (itemErrors: RequestItemError[]) => {
    const first = drafts.find((draft) =>
      itemErrors.some((error) => error.clientId === draft.clientId),
    );
    if (first)
      root.current?.querySelector<HTMLInputElement>(`#request-${first.clientId}-name`)?.focus();
  };
  const submit = () => {
    if (pending) return;
    const parsed = rulebookRequestsSchema.safeParse({ items });
    const validationErrors = parsed.success
      ? []
      : parsed.error.issues.flatMap((issue) => {
          const index = issue.path[1];
          const item = typeof index === "number" ? items[index] : null;
          return item ? [{ clientId: item.clientId, message: issue.message }] : [];
        });
    const itemErrors = [...validationErrors, ...duplicates];
    if (!parsed.success || itemErrors.length) {
      setErrors(itemErrors);
      setSubmitError("표시된 항목을 확인해 주세요. 아직 요청을 보내지 않았습니다.");
      focusError(itemErrors);
      return;
    }
    clearErrors();
    run(() => submitRequests(parsed.data), {
      onSuccess: (result) => {
        toast.success(`${result.createdCount ?? drafts.length}권 추가 요청을 보냈습니다`);
        onSent();
      },
      onError: (result) => {
        setErrors(result.itemErrors ?? []);
        setSubmitError(result.error);
        focusError(result.itemErrors ?? []);
      },
    });
  };
  const addPasted = () => {
    const names = requestNamesFromText(pasteText);
    if (!names.length) {
      setPasteError("책 이름을 한 줄에 하나씩 적어 주세요.");
      return;
    }
    // 아직 입력하지 않은 초기 행은 붙여넣은 첫 책으로 대체한다.
    const existing = drafts.filter(
      (draft) => draft.name.trim() || Object.keys(draft.overrides).length,
    );
    if (existing.length + names.length > RULEBOOK_REQUEST_MAX_BOOKS) {
      setPasteError(
        `한 번에 ${RULEBOOK_REQUEST_MAX_BOOKS}권까지 요청할 수 있습니다. 현재 목록과 합쳐 ${existing.length + names.length}권입니다.`,
      );
      return;
    }
    setDrafts([
      ...existing,
      ...names.map((name) => ({ clientId: crypto.randomUUID(), name, overrides: {} })),
    ]);
    setPasteText("");
    setPasteError("");
    setPasteOpen(false);
    clearErrors();
  };

  return (
    <div ref={root}>
      <fieldset disabled={pending} className="m-0 min-w-0 border-0 p-0">
        <VStack gap="250">
          {intro}
          <section
            className="rounded-300 border border-primary-100 bg-primary-50 p-175"
            aria-label="공통 정보"
          >
            <div className="mb-175 flex items-start gap-125">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-200 bg-surface text-tinted-ink">
                <BookPlus size={20} />
              </div>
              <VStack gap="050">
                <Text typography="subtitle1" render={<h2 />}>
                  함께 요청할 책의 공통 정보
                </Text>
                <Text typography="body4" foreground="muted" render={<p />}>
                  한 번만 입력하면 모든 책에 적용돼요.
                  <br />
                  서로 다른 정보는 책마다 바꿀 수 있습니다.
                </Text>
              </VStack>
            </div>
            <RequestDetailFields
              id="request-common"
              value={defaults}
              categoryNames={categoryNames}
              onChange={(patch) => {
                setDefaults((current) => ({ ...current, ...patch }));
                clearErrors();
              }}
            />
          </section>
          <VStack gap="125">
            <div className="flex flex-wrap items-center justify-between gap-100">
              <div className="flex items-center gap-100">
                <Text typography="subtitle1" render={<h2 />}>
                  요청할 책
                </Text>
                <Badge colorPalette="primary">{drafts.length}권</Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                aria-expanded={pasteOpen}
                aria-controls="request-paste-panel"
                onClick={() => setPasteOpen(!pasteOpen)}
              >
                <ClipboardPaste size={16} />
                여러 이름 붙여넣기
              </Button>
            </div>
            {pasteOpen && (
              <div
                id="request-paste-panel"
                className="rounded-300 border border-gray-200 bg-gray-50 p-175"
              >
                <div className="mb-125 flex items-center justify-between gap-100">
                  <Text typography="subtitle2">책 이름을 한 줄에 하나씩</Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="붙여넣기 닫기"
                    onClick={() => setPasteOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>
                <Field.Root
                  label="책 이름 목록"
                  htmlFor="request-paste"
                  error={pasteError || undefined}
                >
                  <Textarea
                    id="request-paste"
                    rows={5}
                    maxLength={10000}
                    placeholder={
                      "크툴루 나우\n크툴루의 부름 수호자 룰북\n크툴루의 부름 탐사자 핸드북"
                    }
                    value={pasteText}
                    onChange={(event) => {
                      setPasteText(event.target.value);
                      setPasteError("");
                    }}
                  />
                </Field.Root>
                <div className="mt-125 flex justify-end">
                  <Button size="sm" variant="outline" onClick={addPasted}>
                    목록에 추가
                  </Button>
                </div>
              </div>
            )}
            {drafts.map((draft, index) => (
              <RequestBookCard
                key={draft.clientId}
                draft={draft}
                defaults={defaults}
                index={index}
                categoryNames={categoryNames}
                canRemove={drafts.length > 1}
                error={
                  [...errors, ...duplicates].find((error) => error.clientId === draft.clientId)
                    ?.message
                }
                onChange={(patch) => {
                  setDrafts((current) =>
                    current.map((row) =>
                      row.clientId === draft.clientId ? { ...row, ...patch } : row,
                    ),
                  );
                  clearErrors();
                }}
                onRemove={() => {
                  setDrafts((current) => current.filter((row) => row.clientId !== draft.clientId));
                  clearErrors();
                }}
              />
            ))}
            <Button
              variant="outline"
              className="w-full border-dashed"
              disabled={atLimit}
              onClick={() => {
                setDrafts((current) => [
                  ...current,
                  { clientId: crypto.randomUUID(), name: "", overrides: {} },
                ]);
                clearErrors();
              }}
            >
              <Plus size={18} />책 한 권 더 추가
            </Button>
            <Text typography="body4" foreground="hint" className="text-center">
              한 번에 최대 {RULEBOOK_REQUEST_MAX_BOOKS}권 · 한 권만 요청해도 괜찮아요
            </Text>
          </VStack>
          <Callout.Root>
            <Callout.Icon />
            <Callout.Description>
              운영진은 책마다 따로 검토하고 결과를 알려 드립니다.
              <br />
              룰북이 추가된 뒤 소유 인증을 신청할 수 있습니다.
            </Callout.Description>
          </Callout.Root>
          {submitError && (
            <Text role="alert" typography="body3" foreground="danger" render={<p />}>
              {submitError}
            </Text>
          )}
        </VStack>
      </fieldset>
      {renderFooter({
        submit,
        pending,
        disabled: !drafts.some((draft) => draft.name.trim()),
        count: drafts.length,
      })}
    </div>
  );
}
