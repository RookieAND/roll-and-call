"use client";

import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { Button, Callout, Container, Text, TextInput, UiImage, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { certApplyHref, type MyRulebook } from "@/entities/rulebook";
import { useServerPath } from "@/shared/lib";
import { useIsTrial } from "@/shared/trial";

import { APPLY_MODE, type ApplyMode } from "../model/apply-mode";
import { applySubtitle } from "../model/apply-subtitle";
import { pickerCategories } from "../model/picker-categories";
import { useApplySteps } from "../model/use-apply-steps";
import { useBulkSelection } from "../model/use-bulk-selection";
import { ApplyModeStep } from "./apply-mode-step";
import { BulkSelectedChips } from "./bulk-selected-chips";
import { PickerCategorySection } from "./picker-category-section";

interface BookPickerProps {
  rulebooks: MyRulebook[];
  initialRulebookIds: string[];
}

export function BookPicker({ rulebooks, initialRulebookIds }: BookPickerProps) {
  const toServerPath = useServerPath();
  const trial = useIsTrial();
  const initial = rulebooks.find((rulebook) => rulebook.id === initialRulebookIds[0]);
  const [query, setQuery] = useState("");
  const { mode, chooseMode, restoreBulk } = useApplySteps({
    initialMode: trial || initial ? APPLY_MODE.single : null,
  });
  const bulk = mode === APPLY_MODE.bulk;
  const { selectedIds, clear, toggle, persist } = useBulkSelection({
    rulebooks,
    onRestore: restoreBulk,
  });

  const choosingMode = isNull(mode);
  const categories = pickerCategories({ rulebooks, query });
  const searching = !choosingMode;
  const empty = categories.length === 0;
  const chooseApplyMode = (next: ApplyMode) => {
    if (next === APPLY_MODE.single) clear();
    chooseMode(next);
  };
  const bulkApplyHref = toServerPath(certApplyHref({ rulebookIds: selectedIds, step: "photos" }));
  const bulkApplying = bulk && selectedIds.length > 0;
  const selectedBooks = selectedIds.flatMap((id) => {
    const rulebook = rulebooks.find((candidate) => candidate.id === id);
    return rulebook
      ? [{ id, label: [rulebook.shortName, rulebook.edition].filter(Boolean).join(" ") }]
      : [];
  });
  const subtitle = applySubtitle(mode);
  const limitReached = selectedIds.length >= BULK_CERT_MAX_BOOKS;
  const requestHref = toServerPath(
    `/me/rulebooks/apply/request${query.trim() ? `?${new URLSearchParams({ name: query.trim() })}` : ""}`,
  );

  return (
    <>
      {/* ponytail: 3px는 AppBar 아래 Progress 높이. 목록이 짧아도 Callout이 탭바 바로 위에 붙도록 화면 높이를 채운다. */}
      <Container
        size="sm"
        className="flex min-h-[calc(100dvh-var(--rc-size-appbar)-var(--rc-size-tabbar)-var(--rc-safe-bottom)-3px)] flex-col desktop:min-h-0"
      >
        <VStack gap="200" className="pt-250 pb-250">
          <VStack gap="050">
            <Text typography="heading1" render={<h1 />}>
              인증할 책 고르기
            </Text>
            <Text typography="body2" foreground="muted" render={<p />}>
              {subtitle}
            </Text>
          </VStack>
          {choosingMode && <ApplyModeStep onChoose={chooseApplyMode} />}
          {bulkApplying && <BulkSelectedChips books={selectedBooks} onRemove={toggle} />}
          {searching && (
            <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) -mx-200 -my-100 bg-surface px-200 py-100">
              <TextInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="룰북 찾기 (예: CoC, 더크)"
                aria-label="룰북 찾기"
              />
            </div>
          )}

          {searching && empty && (
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

          {!choosingMode && (
            <VStack gap="200">
              {categories.map((candidate) => (
                <PickerCategorySection
                  key={candidate.id}
                  name={candidate.name}
                  books={candidate.editions.flatMap((edition) => edition.rulebooks)}
                  rulebooks={rulebooks}
                  bulk={bulk}
                  selectedIds={selectedIds}
                  limitReached={limitReached}
                  onToggle={toggle}
                />
              ))}
            </VStack>
          )}
        </VStack>
        {!choosingMode && (
          <div className="sticky bottom-[calc(var(--rc-size-tabbar)+var(--rc-safe-bottom))] z-(--rc-z-sticky) -mx-200 mt-auto bg-surface px-200 pt-100 pb-200">
            {bulkApplying ? (
              <VStack gap="075">
                {limitReached && (
                  <Text
                    typography="body4"
                    weight="bold"
                    foreground="danger"
                    className="text-center break-keep"
                    render={<p />}
                  >
                    {`한 번에 최대 ${BULK_CERT_MAX_BOOKS}권까지 신청할 수 있습니다`}
                  </Text>
                )}
                <Button
                  render={<Link href={bulkApplyHref} onClick={persist} />}
                  size="lg"
                  className="w-full"
                >
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
        )}
      </Container>
    </>
  );
}
