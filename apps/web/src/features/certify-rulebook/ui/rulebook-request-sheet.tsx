"use client";

import {
  Button,
  Callout,
  Field,
  RadioCard,
  RadioGroup,
  Sheet,
  Text,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { requestRulebook } from "../api/request-rulebook";
import {
  NEW_CATEGORY,
  REQUEST_KIND_CARDS,
  UNKNOWN,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";
import { OptionSelect } from "./option-select";
import { SheetTitleRow } from "./sheet-title-row";

const UNKNOWN_ITEM = { value: UNKNOWN, label: "잘 모르겠음" };

interface RulebookRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryNames: string[];
  pendingRequestNames: string[];
  initialName: string;
}

// 목록에 없는 룰북 추가 요청. 이미 대기 중인 요청과 이름이 같으면 보내지 않는다.
export function RulebookRequestSheet({
  open,
  onOpenChange,
  categoryNames,
  pendingRequestNames,
  initialName,
}: RulebookRequestSheetProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [edition, setEdition] = useState("");
  const [kind, setKind] = useState<RulebookRequestValues["kind"]>(UNKNOWN);
  const [link, setLink] = useState("");
  const [tried, setTried] = useState(false);
  const { pending, run } = useAction();

  const knownCategory = category !== "" && category !== NEW_CATEGORY && category !== UNKNOWN;
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
  const nameError = tried && !name.trim() ? "룰북 이름을 적어 주세요." : undefined;

  const submit = () => {
    setTried(true);
    if (!name.trim()) return;
    const categoryName = knownCategory
      ? category
      : category === NEW_CATEGORY
        ? newCategory.trim()
        : "";
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
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰북 추가 요청" className="h-[92dvh] px-0">
        <Sheet.Handle />
        <SheetTitleRow title="룰북 추가 요청" />
        <Sheet.Body className="px-200 pb-200">
          <VStack gap="175">
            <Text typography="body3" foreground="muted" render={<p />}>
              추가되면 내 룰북에서 알려 드립니다.
            </Text>
            <Field.Root
              label="룰북 이름"
              htmlFor="rulebook-request-name"
              required
              error={nameError}
            >
              <TextInput
                id="rulebook-request-name"
                maxLength={100}
                placeholder="예: 크툴루 나우"
                value={name}
                invalid={Boolean(nameError)}
                onChange={(event) => setName(event.target.value)}
              />
            </Field.Root>
            {duplicate && (
              <Callout.Root>
                <Callout.Icon />
                <Callout.Description className="break-keep">
                  이미 요청된 룰북입니다.
                  <br />
                  추가되면 내 룰북에서 알려 드립니다.
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
                onValueChange={(value) => setKind(value as RulebookRequestValues["kind"])}
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
        </Sheet.Body>
        <div className="border-t border-gray-100 px-200 pt-150 pb-200">
          <Button
            size="lg"
            className="w-full"
            disabled={duplicate}
            loading={pending}
            onClick={submit}
          >
            추가 요청 보내기
          </Button>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
