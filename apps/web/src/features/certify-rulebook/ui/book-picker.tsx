"use client";

import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
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
  UiImage,
  VStack,
} from "@roll-and-call/ui";
import { ArrowRightLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  certApplyHref,
  certOption,
  CERT_OPTION,
  CERT_STATE,
  RULEBOOK_KIND,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";
import { useServerPath } from "@/shared/lib";
import { useIsTrial } from "@/shared/trial";

import { isBulkSelectable, toggleBulkSelection } from "../model/bulk-selection";
import { bulkSelectionSummary } from "../model/bulk-selection-summary";
import { coreNeedNote } from "../model/core-need-note";
import { pickerCategories } from "../model/picker-categories";
import { recentCategories } from "../model/recent-categories";
import { BulkModeSwitch } from "./bulk-mode-switch";
import { PickerBookRow } from "./picker-book-row";
import { PickerCategoryRow } from "./picker-category-row";
import { pickerListing } from "./picker-listing";

interface BookPickerProps {
  rulebooks: MyRulebook[];
  initialRulebookIds: string[];
  recentRulebookIds: string[];
}

export function BookPicker({ rulebooks, initialRulebookIds, recentRulebookIds }: BookPickerProps) {
  const toServerPath = useServerPath();
  const trial = useIsTrial();
  const initial = rulebooks.find((rulebook) => rulebook.id === initialRulebookIds[0]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? null);
  const [showAll, setShowAll] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allCategories = pickerCategories({ rulebooks, query: "" });
  const category = allCategories.find((candidate) => candidate.id === categoryId);
  const recent = recentCategories({ categories: allCategories, rulebooks, recentRulebookIds });
  const {
    categories: listed,
    title: listTitle,
    recentOnly,
  } = pickerListing({ rulebooks, query, recent, allCategories, showAll });
  const books = category?.editions.flatMap((edition) => edition.rulebooks) ?? [];
  const kinds = Object.values(RULEBOOK_KIND).filter((kind) =>
    books.some((book) => book.kind === kind),
  );
  const needNote = coreNeedNote(books);
  const showBulkSwitch = !trial;
  const bulkApplyHref = toServerPath(certApplyHref({ rulebookIds: selectedIds, step: "photos" }));
  const bulkApplying = bulk && selectedIds.length > 0;
  const selectionSummary = bulkSelectionSummary({ rulebooks, selectedIds });
  const requestHref = toServerPath(
    `/me/rulebooks/apply/request${query.trim() ? `?${new URLSearchParams({ name: query.trim() })}` : ""}`,
  );

  return (
    <>
      {/* ponytail: 3px는 AppBar 아래 Progress 높이. 목록이 짧아도 Callout이 탭바 바로 위에 붙도록 화면 높이를 채운다. */}
      <Container
        size="sm"
        className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-3px)] flex-col"
      >
        <VStack gap="200" className="pt-250 pb-250">
          <VStack gap="050">
            <Text typography="heading1" render={<h1 />}>
              인증할 책 고르기
            </Text>
            <Text typography="body2" foreground="muted" render={<p />}>
              {bulk
                ? "룰을 바꿔 가며 함께 신청할 책을 모두 골라 주세요."
                : "한 번에 한 권씩 신청합니다."}
            </Text>
          </VStack>
          {showBulkSwitch && (
            <BulkModeSwitch
              checked={bulk}
              onCheckedChange={(checked) => {
                setBulk(checked);
                if (!checked) setSelectedIds([]);
              }}
            />
          )}
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
              {recentOnly && (
                <Button
                  variant="ghost"
                  colorPalette="primary"
                  size="sm"
                  className="self-start w-full"
                  onClick={() => setShowAll(true)}
                >
                  + 전체 룰 보기
                </Button>
              )}
            </VStack>
          )}

          {!category && listed.length === 0 && (
            <VStack align="center" gap="100" className="px-150 pt-400 pb-500 text-center">
              <UiImage name="empty-rulebook-search" width={140} height={140} />
              <Text typography="heading3">"{query.trim()}"에 맞는 룰북이 없습니다</Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                정식 이름이나 줄임말로도 찾을 수 있습니다.
                <br />
                목록에 없으면 추가를 요청해 주세요.
              </Text>
              <Button render={<Link href={requestHref} />} variant="tinted" className="mt-100">
                추가 요청
              </Button>
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
                  {bulk ? (
                    <Button variant="tinted" size="sm" onClick={() => setCategoryId(null)}>
                      <ArrowRightLeft size={14} aria-hidden />
                      다른 룰 고르기
                    </Button>
                  ) : (
                    <IconButton
                      variant="ghost"
                      aria-label="카테고리 바꾸기"
                      onClick={() => setCategoryId(null)}
                    >
                      <ArrowRightLeft size={20} />
                    </IconButton>
                  )}
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
                      const option = certOption({ rulebook: book, rulebooks });
                      const available = isBulkSelectable({
                        rulebook: book,
                        rulebooks,
                        selectedIds,
                      });
                      const withCore = bulk && option.type === CERT_OPTION.needsCore && available;
                      return (
                        <PickerBookRow
                          key={book.id}
                          title={book.shortName}
                          edition={book.edition}
                          type={option.type}
                          note={withCore ? "기본 룰북과 함께 신청합니다" : option.note}
                          selection={
                            bulk
                              ? {
                                  checked: selectedIds.includes(book.id),
                                  available,
                                  limitReached: selectedIds.length >= BULK_CERT_MAX_BOOKS,
                                  onToggle: () =>
                                    setSelectedIds((current) =>
                                      toggleBulkSelection({
                                        rulebooks,
                                        selectedIds: current,
                                        rulebookId: book.id,
                                      }),
                                    ),
                                }
                              : null
                          }
                          rejected={book.state === CERT_STATE.rejected}
                          href={toServerPath(
                            certApplyHref({ rulebookIds: [book.id], step: "photos" }),
                          )}
                        />
                      );
                    })}
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
        <div className="sticky bottom-(--rc-size-tabbar) z-(--rc-z-sticky) -mx-200 mt-auto bg-surface px-200 pt-100 pb-200">
          {bulkApplying ? (
            <VStack gap="075">
              <Text typography="body4" foreground="muted" className="break-keep" render={<p />}>
                {`고른 책: ${selectionSummary}`}
              </Text>
              <Button render={<Link href={bulkApplyHref} />} size="lg" className="w-full">
                {`${selectedIds.length}권 신청하기`}
              </Button>
            </VStack>
          ) : (
            <Callout.Root colorPalette="gray">
              <Callout.Title>찾는 룰북이 목록에 없나요?</Callout.Title>
              <Callout.Description className="break-keep">
                추가 요청을 보내 주세요.
                <br />
                추가되면 알림 탭으로 알립니다.
              </Callout.Description>
              <Callout.Action>
                <Button render={<Link href={requestHref} />} variant="outline" size="sm">
                  <Plus size={14} strokeWidth={2.4} aria-hidden />
                  추가 요청
                </Button>
              </Callout.Action>
            </Callout.Root>
          )}
        </div>
      </Container>
    </>
  );
}
