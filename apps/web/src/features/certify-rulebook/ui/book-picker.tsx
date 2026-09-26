"use client";

import {
  Badge,
  Button,
  Callout,
  Card,
  Container,
  HStack,
  IconButton,
  Text,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { ArrowRightLeft, Plus, Search } from "lucide-react";
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
            <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) -mx-200 -my-100 bg-surface px-200 py-100">
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="카테고리 찾기 (예: CoC, 더크)"
                aria-label="카테고리 찾기"
              />
            </div>
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
            </VStack>
          )}

          {category && (
            <VStack gap="300">
              <Card.Root background="subtle" padding="sm">
                <HStack align="center" gap="100" className="pl-050">
                  <VStack gap="050" className="min-w-0 flex-1">
                    <Text typography="body4" weight="bold" foreground="muted">
                      선택한 룰
                    </Text>
                    <HStack align="center" gap="075" wrap>
                      <Text typography="subtitle1">{category.name}</Text>
                      {category.aliases.map((alias) => (
                        <Badge key={alias}>{alias}</Badge>
                      ))}
                    </HStack>
                  </VStack>
                  <IconButton
                    variant="ghost"
                    aria-label="카테고리 바꾸기"
                    onClick={() => setCategoryId(null)}
                  >
                    <ArrowRightLeft size={20} />
                  </IconButton>
                </HStack>
              </Card.Root>
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
        <div className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) -mx-200 bg-surface px-200 pt-100 pb-200">
          <Callout.Root colorPalette="gray">
            <Callout.Title>찾는 룰북이 목록에 없나요?</Callout.Title>
            <Callout.Description className="break-keep">
              신규 룰북 등록을 신청해 주세요.
              <br />
              추가되면 내 룰북에서 확인할 수 있습니다.
            </Callout.Description>
            <Callout.Action>
              <Button variant="outline" size="sm" onClick={() => setRequestOpen(true)}>
                <Plus size={14} strokeWidth={2.4} aria-hidden />
                등록 신청
              </Button>
            </Callout.Action>
          </Callout.Root>
        </div>
      </Container>

      <RulebookRequestSheet
        open={requestOpen}
        onOpenChange={setRequestOpen}
        categoryNames={[...new Set(rulebooks.map((rulebook) => rulebook.categoryName))]}
        pendingRequestNames={pendingRequestNames}
        initialName={query.trim()}
      />
    </>
  );
}
