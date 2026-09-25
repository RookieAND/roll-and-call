"use client";

import { Button, Callout, Sheet, Text, TextInput, VStack } from "@roll-and-call/ui";
import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";

import {
  CERT_OPTION,
  certOption,
  groupByCategory,
  RULEBOOK_KIND,
  type MyRulebook,
} from "@/entities/rulebook";

import { filterRulebooks } from "../model/filter-rulebooks";
import { selectionSummary } from "../model/selection-summary";
import { toggleSelection } from "../model/toggle-selection";
import { CertBookRow } from "./cert-book-row";
import { SheetTitleRow } from "./sheet-title-row";

interface CertRulebookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rulebooks: MyRulebook[];
  selectedIds: string[];
  onConfirm: (rulebookIds: string[]) => void;
  onRequest: () => void;
}

// 카테고리 → 판본 → 책 순. 같은 판본의 기본 룰북은 여러 권을 함께 고른다.
export function CertRulebookSheet({
  open,
  onOpenChange,
  rulebooks,
  selectedIds,
  onConfirm,
  onRequest,
}: CertRulebookSheetProps) {
  const [query, setQuery] = useState("");
  const [draftIds, setDraftIds] = useState(selectedIds);
  const selected = rulebooks.filter((rulebook) => draftIds.includes(rulebook.id));
  const bookCount = (categoryId: string) =>
    rulebooks.filter((rulebook) => rulebook.categoryId === categoryId).length;
  const categories = groupByCategory(filterRulebooks(rulebooks, query));
  const summary = selectionSummary(selected);
  const cta =
    selected.length === 0
      ? "룰북을 골라 주세요"
      : selected.length === 1
        ? "선택하기"
        : `${selected.length}권 함께 신청하기`;

  // 고르지 않고 닫으면 고르던 것을 버린다.
  const handleOpenChange = (next: boolean) => {
    if (!next) setDraftIds(selectedIds);
    onOpenChange(next);
  };

  return (
    <Sheet.Root open={open} onOpenChange={handleOpenChange}>
      <Sheet.Overlay />
      <Sheet.Popup aria-label="룰북 선택" className="h-[92dvh] px-0">
        <Sheet.Handle />
        <SheetTitleRow title="룰북 선택" />
        <div className="px-200 pt-050 pb-100">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름·줄임말로 찾기 (예: CoC, 더크)"
            aria-label="룰북 찾기"
          />
        </div>
        <Sheet.Body className="px-200">
          {categories.length === 0 && (
            <VStack align="center" gap="100" className="px-150 pt-400 pb-500 text-center">
              <span className="mb-075 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Search size={26} aria-hidden />
              </span>
              <Text typography="subtitle1">"{query.trim()}"에 맞는 룰북이 없습니다</Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                이름, 줄임말, 다른 이름으로도 찾을 수 있습니다.
                <br />
                목록에 없으면 추가를 요청해 주세요.
              </Text>
              <Button variant="tinted" onClick={onRequest} className="mt-100">
                추가 요청하기
              </Button>
            </VStack>
          )}
          {categories.map((category) => {
            const grouped = bookCount(category.id) > 1;
            return (
              <VStack
                key={category.id}
                gap="025"
                className="border-b border-gray-100 pt-100 pb-125"
              >
                {grouped && (
                  <Text
                    typography="body2"
                    weight="extrabold"
                    render={<h3 />}
                    className="pt-050 pb-075"
                  >
                    {category.name}
                  </Text>
                )}
                {category.editions.map(({ edition, rulebooks: books }) => {
                  const cores = rulebooks.filter(
                    (rulebook) =>
                      rulebook.categoryId === category.id &&
                      rulebook.edition === edition &&
                      rulebook.kind === RULEBOOK_KIND.core,
                  );
                  const needsSet =
                    cores.length > 1 &&
                    cores.some((core) => certOption(core, rulebooks).type === CERT_OPTION.pick);
                  return (
                    <VStack key={edition} gap="025">
                      {needsSet && (
                        <Callout.Root colorPalette="primary" className="mb-075">
                          <Callout.Description className="break-keep [text-wrap:pretty]">
                            {cores.map((core) => core.shortName).join(", ")} 모두 인증받아야 GM을 열
                            수 있습니다.
                            <br />
                            {cores.length}권을 함께 골라 한 번에 신청할 수 있습니다.
                          </Callout.Description>
                        </Callout.Root>
                      )}
                      {grouped && edition && (
                        <Text
                          typography="body4"
                          weight="bold"
                          foreground="muted"
                          className="pt-050 pb-025 font-mono"
                        >
                          {edition}
                        </Text>
                      )}
                      {books.map((rulebook) => {
                        const option = certOption(rulebook, rulebooks);
                        return (
                          <CertBookRow
                            key={rulebook.id}
                            rulebook={rulebook}
                            title={grouped ? rulebook.shortName : rulebook.label}
                            type={option.type}
                            note={option.note}
                            selected={draftIds.includes(rulebook.id)}
                            onToggle={() =>
                              setDraftIds(
                                toggleSelection(selected, rulebook).map((book) => book.id),
                              )
                            }
                            onJump={() => setDraftIds(option.missing.map((core) => core.id))}
                          />
                        );
                      })}
                    </VStack>
                  );
                })}
              </VStack>
            );
          })}
        </Sheet.Body>
        <VStack gap="100" className="border-t border-gray-100 px-200 pt-050 pb-200">
          <Button
            variant="ghost"
            colorPalette="primary"
            onClick={onRequest}
            className="min-h-11 w-full justify-between px-0"
          >
            찾는 룰북이 없어요
            <ChevronRight size={16} aria-hidden />
          </Button>
          {summary && (
            <Text typography="body4" weight="medium" foreground="muted" className="text-center">
              {summary}
            </Text>
          )}
          <Button
            size="lg"
            className="w-full"
            disabled={selected.length === 0}
            onClick={() => {
              onConfirm(draftIds);
              onOpenChange(false);
            }}
          >
            {cta}
          </Button>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
