"use client";

import { Button, Container, HStack, IconButton, Text, TextInput, VStack } from "@roll-and-call/ui";
import { ArrowRightLeft, Search } from "lucide-react";
import { useState } from "react";

import {
  certApplyHref,
  certOption,
  CERT_STATE,
  RULEBOOK_KIND,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";

import { coreNeedNote } from "../model/core-need-note";
import { pickerCategories } from "../model/picker-categories";
import { recentCategories } from "../model/recent-categories";
import { PickerBookRow } from "./picker-book-row";
import { PickerCategoryRow } from "./picker-category-row";
import { RulebookRequestSheet } from "./rulebook-request-sheet";

interface BookPickerProps {
  rulebooks: MyRulebook[];
  initialRulebookIds: string[];
  recentRulebookIds: string[];
  pendingRequestNames: string[];
}

// 신청 1단계. 카테고리를 찾아 고르고, 판본을 한 목록에 모은 책 가운데 한 권을 누르면 2단계로 간다.
export function BookPicker({
  rulebooks,
  initialRulebookIds,
  recentRulebookIds,
  pendingRequestNames,
}: BookPickerProps) {
  const initial = rulebooks.find((rulebook) => rulebook.id === initialRulebookIds[0]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? null);
  const [requestOpen, setRequestOpen] = useState(false);

  const allCategories = pickerCategories(rulebooks, "");
  const category = allCategories.find((candidate) => candidate.id === categoryId);
  const searching = query.trim() !== "";
  const recent = recentCategories({ categories: allCategories, rulebooks, recentRulebookIds });
  const listed = searching
    ? pickerCategories(rulebooks, query)
    : recent.length > 0
      ? recent
      : allCategories;
  const listTitle = searching
    ? `검색 결과 ${listed.length}개`
    : recent.length > 0
      ? "최근 구인을 연 룰"
      : "";
  const books = category?.editions.flatMap((edition) => edition.rulebooks) ?? [];
  const kinds = Object.values(RULEBOOK_KIND).filter((kind) =>
    books.some((book) => book.kind === kind),
  );
  const needNote = coreNeedNote(books);

  return (
    <>
      <Container size="sm">
        <VStack gap="200" className="pt-250 pb-250">
          <VStack gap="050">
            <Text typography="heading1" render={<h1 />}>
              인증할 책 고르기
            </Text>
            <Text typography="body2" foreground="muted" render={<p />}>
              한 번에 한 권씩 신청합니다.
            </Text>
          </VStack>
          {!category && (
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="카테고리 찾기 (예: CoC, 더크)"
              aria-label="카테고리 찾기"
            />
          )}

          {!category && listed.length > 0 && (
            <VStack gap="050">
              {listTitle && (
                <Text typography="body3" weight="bold" foreground="muted">
                  {listTitle}
                </Text>
              )}
              <VStack>
                {listed.map((candidate) => (
                  <PickerCategoryRow
                    key={candidate.id}
                    category={candidate}
                    onPick={() => setCategoryId(candidate.id)}
                  />
                ))}
              </VStack>
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

          {!category && listed.length === 0 && (
            <VStack align="center" gap="100" className="px-150 pt-400 pb-500 text-center">
              <span className="mb-075 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Search size={26} aria-hidden />
              </span>
              <Text typography="heading3">"{query.trim()}"에 맞는 룰북이 없습니다</Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                정식 이름이나 줄임말로도 찾을 수 있습니다.
                <br />
                목록에 없으면 추가를 요청해 주세요.
              </Text>
              <Button variant="tinted" onClick={() => setRequestOpen(true)} className="mt-100">
                목록에 없는 룰북 요청하기
              </Button>
            </VStack>
          )}

          {category && (
            <VStack gap="300">
              <HStack align="center" gap="100">
                <HStack align="baseline" gap="100" className="min-w-0 flex-1">
                  <Text typography="subtitle1">{category.name}</Text>
                  {category.alias && (
                    <Text typography="body4" foreground="hint" truncate>
                      {category.alias}
                    </Text>
                  )}
                </HStack>
                <IconButton
                  variant="ghost"
                  aria-label="카테고리 바꾸기"
                  onClick={() => setCategoryId(null)}
                >
                  <ArrowRightLeft size={20} />
                </IconButton>
              </HStack>
              {kinds.map((kind) => (
                <VStack key={kind} gap="100">
                  <VStack gap="025">
                    <Text typography="body3" weight="bold" foreground="muted">
                      {RULEBOOK_KIND_GROUP[kind]}
                    </Text>
                    {kind === RULEBOOK_KIND.core && needNote && (
                      <Text typography="body4" foreground="muted" className="break-keep">
                        {needNote}
                      </Text>
                    )}
                  </VStack>
                  {books
                    .filter((book) => book.kind === kind)
                    .map((book) => {
                      const option = certOption(book, rulebooks);
                      return (
                        <PickerBookRow
                          key={book.id}
                          title={book.shortName}
                          edition={book.edition}
                          type={option.type}
                          note={option.note}
                          rejected={book.state === CERT_STATE.rejected}
                          href={certApplyHref([book.id], "photos")}
                        />
                      );
                    })}
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>

      <RulebookRequestSheet
        open={requestOpen}
        onOpenChange={setRequestOpen}
        categoryNames={allCategories.map((candidate) => candidate.name)}
        pendingRequestNames={pendingRequestNames}
        initialName={query.trim()}
      />
    </>
  );
}
