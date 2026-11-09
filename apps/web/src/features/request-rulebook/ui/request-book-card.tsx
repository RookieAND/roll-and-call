"use client";

import { Badge, Button, Field, IconButton, Text, TextInput } from "@roll-and-call/ui";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  REQUEST_KIND_CARDS,
  resolveRequestDraft,
  type RequestDefaults,
  type RequestDraft,
} from "../model/rulebook-request-form";
import { RequestDetailFields } from "./request-detail-fields";

interface RequestBookCardProps {
  draft: RequestDraft;
  defaults: RequestDefaults;
  index: number;
  categoryNames: string[];
  error?: string;
  canRemove: boolean;
  onChange: (patch: Partial<RequestDraft>) => void;
  onRemove: () => void;
}

export function RequestBookCard({
  draft,
  defaults,
  index,
  categoryNames,
  error,
  canRemove,
  onChange,
  onRemove,
}: RequestBookCardProps) {
  const [expanded, setExpanded] = useState(false);
  const value = resolveRequestDraft(draft, defaults);
  const customized = Object.keys(draft.overrides).length > 0;
  const summary = [
    value.category,
    value.edition,
    REQUEST_KIND_CARDS.find((card) => card.value === value.kind)?.title,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <section
      className={`rounded-300 border bg-surface p-175 ${error ? "border-danger-300" : "border-gray-200"}`}
      aria-label={`${index + 1}번째 책`}
    >
      <div className="mb-125 flex items-center justify-between gap-100">
        <div className="flex items-center gap-100">
          <Text typography="body4" weight="bold" foreground="muted" numeric>
            BOOK {String(index + 1).padStart(2, "0")}
          </Text>
          {customized && <Badge colorPalette="gray">개별 설정</Badge>}
        </div>
        {canRemove && (
          <IconButton size="sm" aria-label={`${index + 1}번째 책 삭제`} onClick={onRemove}>
            <Trash2 size={16} />
          </IconButton>
        )}
      </div>
      <Field.Root
        label="룰북 이름"
        htmlFor={`request-${draft.clientId}-name`}
        required
        error={error}
      >
        <TextInput
          id={`request-${draft.clientId}-name`}
          placeholder="예: 크툴루 나우"
          value={draft.name}
          maxLength={100}
          invalid={Boolean(error)}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field.Root>
      <div className="mt-125 flex flex-wrap items-center justify-between gap-050">
        <Text typography="body4" foreground="muted" className="min-w-0 flex-1 break-words">
          {summary || "공통 정보를 입력하거나 세부 정보를 설정해 주세요"}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={expanded}
          aria-controls={`request-${draft.clientId}-details`}
          onClick={() => setExpanded(!expanded)}
        >
          세부 정보 {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </Button>
      </div>
      {expanded && (
        <div
          id={`request-${draft.clientId}-details`}
          className="mt-150 border-t border-gray-100 pt-150"
        >
          <div className="mb-150 flex items-center justify-between gap-100">
            <Text typography="body4" foreground="muted">
              이 책에만 다른 정보를 적용할 수 있어요.
            </Text>
            {customized && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onChange({ overrides: {} });
                  setExpanded(false);
                }}
              >
                공통값 사용
              </Button>
            )}
          </div>
          <RequestDetailFields
            id={`request-${draft.clientId}`}
            value={value}
            categoryNames={categoryNames}
            onChange={(patch) => onChange({ overrides: { ...draft.overrides, ...patch } })}
          />
        </div>
      )}
    </section>
  );
}
