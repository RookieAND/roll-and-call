"use client";

import { Field, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

import { OptionSelect } from "@/shared/ui";

import {
  NEW_CATEGORY,
  REQUEST_KIND_CARDS,
  UNKNOWN,
  type RequestDetails,
} from "../model/rulebook-request-form";

interface RequestDetailFieldsProps {
  id: string;
  value: RequestDetails;
  categoryNames: string[];
  onChange: (patch: Partial<RequestDetails>) => void;
}

export function RequestDetailFields({
  id,
  value,
  categoryNames,
  onChange,
}: RequestDetailFieldsProps) {
  const [customCategory, setCustomCategory] = useState(false);
  const custom =
    customCategory || Boolean(value.category && !categoryNames.includes(value.category));
  return (
    <div className="grid gap-150 sm:grid-cols-2">
      <Field.Root label="카테고리" htmlFor={`${id}-category`}>
        <OptionSelect
          id={`${id}-category`}
          placeholder="카테고리 선택"
          items={[
            { value: UNKNOWN, label: "잘 모르겠음" },
            ...categoryNames.map((name) => ({ value: name, label: name })),
            { value: NEW_CATEGORY, label: "목록에 없음 · 직접 입력" },
          ]}
          value={custom ? NEW_CATEGORY : value.category || UNKNOWN}
          onChange={(category) => {
            setCustomCategory(category === NEW_CATEGORY);
            onChange({
              category: category === NEW_CATEGORY || category === UNKNOWN ? "" : category,
            });
          }}
        />
        {custom && (
          <TextInput
            aria-label="새 카테고리 이름"
            placeholder="카테고리 이름"
            maxLength={100}
            value={value.category}
            onChange={(event) => onChange({ category: event.target.value })}
          />
        )}
      </Field.Root>
      <Field.Root label="판본" htmlFor={`${id}-edition`}>
        <TextInput
          id={`${id}-edition`}
          placeholder="예: 7판 · 모르면 비워 두세요"
          maxLength={50}
          value={value.edition}
          onChange={(event) => onChange({ edition: event.target.value })}
        />
      </Field.Root>
      <Field.Root label="종류" htmlFor={`${id}-kind`}>
        <OptionSelect
          id={`${id}-kind`}
          placeholder="종류 선택"
          items={[
            { value: UNKNOWN, label: "잘 모르겠음" },
            ...REQUEST_KIND_CARDS.map((card) => ({ value: card.value, label: card.title })),
          ]}
          value={value.kind}
          onChange={(kind) => {
            if (kind === UNKNOWN || kind === "core" || kind === "supplement" || kind === "handbook")
              onChange({ kind });
          }}
        />
      </Field.Root>
      <Field.Root label="참고 링크 (선택)" htmlFor={`${id}-link`}>
        <TextInput
          id={`${id}-link`}
          type="url"
          placeholder="출판사나 판매 페이지 주소"
          maxLength={500}
          value={value.link}
          onChange={(event) => onChange({ link: event.target.value })}
        />
      </Field.Root>
    </div>
  );
}
