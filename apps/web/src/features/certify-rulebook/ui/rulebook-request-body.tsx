"use client";

import { Callout, Field, RadioCard, RadioGroup, Text, TextInput, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebook } from "../api/request-rulebook";
import { isRequestKind } from "../model/is-request-kind";
import {
  NEW_CATEGORY,
  REQUEST_KIND_CARDS,
  UNKNOWN,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";
import { OptionSelect } from "./option-select";
import { requestCategoryName } from "./request-category-name";

const UNKNOWN_ITEM = { value: UNKNOWN, label: "잘 모르겠음" };

interface RulebookRequestBodyProps {
  categoryNames: string[];
  pendingRequestNames: string[];
  initialName: string;
  intro: ReactNode;
  onSent: () => void;
  renderFooter: (footer: { submit: () => void; pending: boolean; disabled: boolean }) => ReactNode;
}

export function RulebookRequestBody({
  categoryNames,
  pendingRequestNames,
  initialName,
  intro,
  onSent,
  renderFooter,
}: RulebookRequestBodyProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [edition, setEdition] = useState("");
  const [kind, setKind] = useState<RulebookRequestValues["kind"]>(UNKNOWN);
  const [link, setLink] = useState("");
  const [edited, setEdited] = useState(false);
  const { pending, run } = useAction();

  const categoryItems = [
    ...categoryNames.map((categoryName) => ({ value: categoryName, label: categoryName })),
    { value: NEW_CATEGORY, label: "목록에 없음 (새 카테고리)" },
    UNKNOWN_ITEM,
  ];
  const typedEdition = edition.trim();
  const requested = `${name.trim()} ${typedEdition}`.trim().toLowerCase();
  const duplicate = pendingRequestNames.some(
    (pendingName) => pendingName.toLowerCase() === requested,
  );
  const nameError = edited && !name.trim() ? "룰북 이름을 적어 주세요." : undefined;

  const submit = () => {
    if (!name.trim()) return;
    const categoryName = requestCategoryName({ category, newCategory });
    run(
      () =>
        requestRulebook({
          name,
          edition: typedEdition,
          kind,
          category: categoryName,
          link: link.trim(),
        }),
      {
        onSuccess: () => {
          toast.success("추가 요청을 보냈습니다");
          onSent();
        },
      },
    );
  };

  return (
    <>
      <VStack gap="175">
        {intro}
        <Field.Root label="룰북 이름" htmlFor="rulebook-request-name" required error={nameError}>
          <TextInput
            id="rulebook-request-name"
            maxLength={100}
            placeholder="예: 크툴루 나우"
            value={name}
            invalid={Boolean(nameError)}
            onChange={(event) => {
              setName(event.target.value);
              setEdited(true);
            }}
          />
        </Field.Root>
        {duplicate && (
          <Callout.Root>
            <Callout.Icon />
            <Callout.Description className="break-keep">
              이미 요청된 룰북입니다.
              <br />
              추가되면 알림 탭으로 알립니다.
            </Callout.Description>
          </Callout.Root>
        )}
        <Field.Root label="카테고리" htmlFor="rulebook-request-category">
          <OptionSelect
            id="rulebook-request-category"
            placeholder="카테고리를 골라 주세요"
            items={categoryItems}
            value={category}
            onChange={setCategory}
          />
          {category === NEW_CATEGORY && (
            <>
              <TextInput
                maxLength={100}
                placeholder="카테고리 이름 (예: 네크로니카)"
                aria-label="새 카테고리 이름"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              />
              <Text typography="body4" foreground="muted">
                목록에 없는 카테고리는 운영진이 새로 만듭니다.
              </Text>
            </>
          )}
        </Field.Root>
        <Field.Root label="판본" htmlFor="rulebook-request-edition">
          <TextInput
            id="rulebook-request-edition"
            maxLength={50}
            placeholder="예: 7판, 3rd, 신판"
            value={edition}
            onChange={(event) => setEdition(event.target.value)}
          />
          <Text typography="body4" foreground="muted">
            비워 두면 '잘 모르겠음'으로 전달됩니다.
          </Text>
        </Field.Root>
        <VStack gap="100">
          <Text typography="body2" weight="bold">
            종류
          </Text>
          <RadioGroup
            value={kind}
            onValueChange={(value) => {
              if (isRequestKind(value)) setKind(value);
            }}
            aria-label="종류"
            className="flex flex-col gap-100"
          >
            {REQUEST_KIND_CARDS.map((card) => (
              <RadioCard.Root key={card.value} value={card.value} indicator="radio">
                <RadioCard.Title>{card.title}</RadioCard.Title>
                <RadioCard.Description>{card.description}</RadioCard.Description>
                <RadioCard.Indicator />
              </RadioCard.Root>
            ))}
          </RadioGroup>
        </VStack>
        <Field.Root label="참고 링크 (선택)" htmlFor="rulebook-request-link">
          <TextInput
            id="rulebook-request-link"
            type="url"
            maxLength={500}
            placeholder="출판사나 판매 페이지 주소"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </Field.Root>
      </VStack>
      {renderFooter({ submit, pending, disabled: duplicate || !name.trim() })}
    </>
  );
}
