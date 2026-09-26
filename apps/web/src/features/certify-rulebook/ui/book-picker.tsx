"use client";

import {
  Button,
  Callout,
  Container,
  FloatingBar,
  HStack,
  SegmentedControl,
  Text,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  certApplyHref,
  CERT_STATE,
  RULEBOOK_KIND,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";

import { initialSelection } from "../model/initial-selection";
import { pickerCategories } from "../model/picker-categories";
import { PICKER_ROW, pickerRow } from "../model/picker-row";
import { selectionSummary } from "../model/selection-summary";
import { togglePick } from "../model/toggle-pick";
import { PickerBookRow } from "./picker-book-row";
import { PickerCategoryRow } from "./picker-category-row";
import { RulebookRequestSheet } from "./rulebook-request-sheet";

interface BookPickerProps {
  rulebooks: MyRulebook[];
  initialRulebookIds: string[];
  pendingRequestNames: string[];
}

// 신청 1단계. 카테고리를 찾아 고르고, 판본을 정한 뒤 그 판본의 책을 담는다.
export function BookPicker({
  rulebooks,
  initialRulebookIds,
  pendingRequestNames,
}: BookPickerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState(() =>
    initialSelection(rulebooks, initialRulebookIds),
  );
  const initial = rulebooks.find((rulebook) => rulebook.id === selectedIds[0]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? null);
  const [edition, setEdition] = useState(initial?.edition ?? "");
  const [requestOpen, setRequestOpen] = useState(false);

  const categories = pickerCategories(rulebooks, query);
  const category = pickerCategories(rulebooks, "").find((candidate) => candidate.id === categoryId);
  const books =
    category?.editions.find((candidate) => candidate.edition === edition)?.rulebooks ?? [];
  const selected = rulebooks.filter((rulebook) => selectedIds.includes(rulebook.id));
  const cores = books.filter((rulebook) => rulebook.kind === RULEBOOK_KIND.core);
  const pickableCores = cores.filter(
    (core) => pickerRow(core, rulebooks, selectedIds).type === PICKER_ROW.pick,
  );
  const allCoresPicked = pickableCores.every((core) => selectedIds.includes(core.id));
  const showNeed = cores.length > 1 && pickableCores.length > 0;
  const kinds = Object.values(RULEBOOK_KIND).filter((kind) =>
    books.some((book) => book.kind === kind),
  );
  const categoryNames = pickerCategories(rulebooks, "").map((candidate) => candidate.name);

  const pickCategory = (id: string) => {
    const next = pickerCategories(rulebooks, "").find((candidate) => candidate.id === id);
    setCategoryId(id);
    setEdition(next?.editions[0]?.edition ?? "");
    setSelectedIds([]);
  };

  const changeEdition = (value: string) => {
    setEdition(value);
    setSelectedIds([]);
  };

  const fillCores = () =>
    setSelectedIds(
      pickableCores.reduce(
        (ids, core) => (ids.includes(core.id) ? ids : togglePick(ids, core.id, rulebooks)),
        selectedIds,
      ),
    );

  return (
    <>
      <Container size="sm">
        <VStack gap="200" className="pt-250 pb-250">
          <Text typography="heading1" render={<h1 />}>
            인증할 책 고르기
          </Text>
          {!category && (
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="카테고리 찾기 (예: CoC, 더크)"
              aria-label="카테고리 찾기"
            />
          )}

          {!category && categories.length > 0 && (
            <VStack>
              {categories.map((candidate) => (
                <PickerCategoryRow
                  key={candidate.id}
                  category={candidate}
                  onPick={() => pickCategory(candidate.id)}
                />
              ))}
              <Button
                variant="ghost"
                colorPalette="primary"
                onClick={() => setRequestOpen(true)}
                className="mt-100 self-start"
              >
                목록에 없는 룰북 요청하기
              </Button>
            </VStack>
          )}

          {!category && categories.length === 0 && (
            <VStack align="center" gap="100" className="px-150 pt-400 pb-500 text-center">
              <span className="mb-075 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Search size={26} aria-hidden />
              </span>
              <Text typography="heading3">"{query.trim()}"에 맞는 룰북이 없습니다</Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                이름, 줄임말, 다른 이름으로도 찾을 수 있습니다.
                <br />
                목록에 없으면 추가를 요청해 주세요.
              </Text>
              <Button variant="tinted" onClick={() => setRequestOpen(true)} className="mt-100">
                목록에 없는 룰북 요청하기
              </Button>
            </VStack>
          )}

          {category && (
            <VStack gap="175">
              <HStack align="center" gap="100">
                <HStack align="baseline" gap="100" className="min-w-0 flex-1">
                  <Text typography="subtitle1">{category.name}</Text>
                  {category.alias && (
                    <Text typography="body4" foreground="hint" truncate>
                      {category.alias}
                    </Text>
                  )}
                </HStack>
                <Button variant="ghost" onClick={() => setCategoryId(null)}>
                  바꾸기
                </Button>
              </HStack>
              {category.editions.length > 1 && (
                <SegmentedControl.Root
                  value={edition}
                  onValueChange={changeEdition}
                  aria-label="판본"
                >
                  {category.editions.map((item) => (
                    <SegmentedControl.Item key={item.edition} value={item.edition}>
                      {item.edition || "기본판"}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl.Root>
              )}
              {showNeed && (
                <Callout.Root colorPalette="primary">
                  <Callout.Description className="break-keep">
                    GM이 되려면 기본 룰북 {cores.length}권이 모두 필요합니다.
                  </Callout.Description>
                  <Callout.Action>
                    <Button size="sm" disabled={allCoresPicked} onClick={fillCores}>
                      {allCoresPicked ? "모두 담았습니다" : "기본 룰북 모두 담기"}
                    </Button>
                  </Callout.Action>
                </Callout.Root>
              )}
              {kinds.map((kind) => (
                <VStack key={kind} gap="025">
                  <Text typography="body3" weight="bold" foreground="muted" className="pb-050">
                    {RULEBOOK_KIND_GROUP[kind]}
                  </Text>
                  {books
                    .filter((book) => book.kind === kind)
                    .map((book) => {
                      const row = pickerRow(book, rulebooks, selectedIds);
                      return (
                        <PickerBookRow
                          key={book.id}
                          title={book.shortName}
                          type={row.type}
                          note={row.note}
                          selected={selectedIds.includes(book.id)}
                          rejected={book.state === CERT_STATE.rejected}
                          onToggle={() =>
                            setSelectedIds(togglePick(selectedIds, book.id, rulebooks))
                          }
                        />
                      );
                    })}
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <VStack gap="100">
              <Text typography="body4" weight="medium" foreground="muted" className="text-center">
                {selectionSummary(selected)}
              </Text>
              <Button
                size="lg"
                className="w-full"
                disabled={selected.length === 0}
                onClick={() => router.push(certApplyHref(selectedIds, "photos"))}
              >
                다음
              </Button>
            </VStack>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>

      <RulebookRequestSheet
        open={requestOpen}
        onOpenChange={setRequestOpen}
        rulebooks={rulebooks}
        categoryNames={categoryNames}
        pendingRequestNames={pendingRequestNames}
        initialName={query.trim()}
      />
    </>
  );
}
