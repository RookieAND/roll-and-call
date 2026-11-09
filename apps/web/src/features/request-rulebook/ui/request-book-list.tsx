"use client";

import { RULEBOOK_REQUEST_MAX_BOOKS } from "@roll-and-call/database/rulebooks/model";
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
      <Text typography="body4" foreground="muted" render={<p />}>
        목록에서 책을 선택해 내용을 수정할 수 있어요.
      </Text>
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
      <Text typography="body5" foreground="hint" render={<p />} className="mb-175">
        최대 {RULEBOOK_REQUEST_MAX_BOOKS}권까지 함께 요청할 수 있어요.
      </Text>
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
      <Text typography="body5" foreground="muted" render={<p />} className="mt-125 break-keep">
        운영진은 책마다 따로 검토하고, 결과를 알림으로 알려 드립니다.
      </Text>
    </section>
  );
}
