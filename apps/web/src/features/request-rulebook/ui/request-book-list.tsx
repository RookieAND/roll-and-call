"use client";

import { Badge, Button, IconButton, Text, cn } from "@roll-and-call/ui";
import { BookOpen, Trash2 } from "lucide-react";

import {
  REQUEST_KIND_CARDS,
  type RequestDraft,
  type RequestItemError,
} from "../model/rulebook-request-form";

interface RequestBookListProps {
  drafts: RequestDraft[];
  activeId: string;
  errors: RequestItemError[];
  pending: boolean;
  submitError: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onSubmit: () => void;
}

export function RequestBookList({
  drafts,
  activeId,
  errors,
  pending,
  submitError,
  onSelect,
  onRemove,
  onSubmit,
}: RequestBookListProps) {
  return (
    <section
      aria-label="요청할 룰북 목록"
      className="rounded-600 border border-gray-200 bg-surface p-200"
    >
      <div className="mb-075 flex items-center justify-between gap-100">
        <Text typography="subtitle1" render={<h2 />}>
          요청할 룰북
        </Text>
        <Badge colorPalette="primary">{drafts.length}권</Badge>
      </div>
      <fieldset disabled={pending} className="m-0 min-w-0 border-0 p-0">
        <ol className="my-175 max-h-[50dvh] space-y-075 overflow-y-auto" aria-label="작성한 룰북">
          {drafts.map((draft, index) => {
            const active = draft.clientId === activeId;
            const error = errors.find((entry) => entry.clientId === draft.clientId)?.message;
            const kind = REQUEST_KIND_CARDS.find((card) => card.value === draft.kind)?.title;
            const description = [draft.category, draft.edition, kind].filter(Boolean).join(" · ");
            return (
              <li
                key={draft.clientId}
                className={cn(
                  "flex items-start gap-050 rounded-300 border p-075",
                  active ? "border-primary-300 bg-primary-50" : "border-gray-200",
                  error && "border-danger-300",
                )}
              >
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  aria-label={`${index + 1}번째 룰북 ${draft.name.trim() || "새 룰북"} 수정`}
                  className="flex min-w-0 flex-1 items-start gap-100 rounded-200 p-075 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  onClick={() => onSelect(draft.clientId)}
                >
                  <BookOpen size={16} aria-hidden className="mt-025 shrink-0 text-gray-500" />
                  <span className="min-w-0 flex-1">
                    <Text typography="body3" weight="bold" className="block break-words">
                      {draft.name.trim() || "새 룰북"}
                    </Text>
                    <Text
                      typography="body5"
                      foreground="muted"
                      className="mt-050 block break-words"
                    >
                      {description || "룰북 정보를 입력해 주세요"}
                    </Text>
                    {error && (
                      <Text typography="body5" foreground="danger" className="mt-050 block">
                        {error}
                      </Text>
                    )}
                  </span>
                </button>
                {drafts.length > 1 && (
                  <IconButton
                    size="sm"
                    aria-label={`${index + 1}번째 룰북 삭제`}
                    onClick={() => onRemove(draft.clientId)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                )}
              </li>
            );
          })}
        </ol>
      </fieldset>
      {submitError && (
        <Text role="alert" typography="body4" foreground="danger" render={<p />} className="mb-125">
          {submitError}
        </Text>
      )}
      <Button
        size="lg"
        className="w-full"
        loading={pending}
        disabled={!drafts.some((draft) => draft.name.trim())}
        onClick={onSubmit}
      >
        {drafts.length}권 추가 요청 보내기
      </Button>
    </section>
  );
}
