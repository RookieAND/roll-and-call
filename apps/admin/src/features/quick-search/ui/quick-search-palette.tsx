"use client";

import { Dialog, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { use } from "react";

import type { PendingItem } from "@/shared/server";
import { Kbd, useDesktop } from "@/shared/ui";

import { useQuickSearch } from "../model/use-quick-search";
import { MobileQuickSearch } from "./mobile-quick-search";
import { PaletteFooter } from "./palette-footer";
import { PaletteMessage } from "./palette-message";
import { PaletteRow } from "./palette-row";

interface QuickSearchPaletteProps {
  pendingItemsPromise: Promise<PendingItem[]>;
  owner: boolean;
}

// 1024px 아래는 팔레트 대신 화면 전체 검색을 연다. 닫혀 있다가 눌러서 여는 화면이라 첫 화면이 깜박이지 않는다.
export function QuickSearchPalette({ pendingItemsPromise, owner }: QuickSearchPaletteProps) {
  const pendingItems = use(pendingItemsPromise);
  const search = useQuickSearch({ pendingItems, owner });
  const desktop = useDesktop();
  const {
    open,
    setOpen,
    query,
    searching,
    noResult,
    shownGroups,
    items,
    activeItem,
    setActiveIndex,
    changeQuery,
    close,
    onKeyDown,
  } = search;

  if (!desktop) return <MobileQuickSearch search={search} owner={owner} />;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <Dialog.Popup className="top-[84px] max-h-[calc(100dvh-116px)] max-w-[600px] translate-y-0 gap-0 overflow-hidden rounded-800 p-0">
        <Dialog.Title className="sr-only">빠른 이동</Dialog.Title>
        <HStack
          align="center"
          gap="125"
          className="border-b border-(--rc-color-border-subtle) px-200 py-175"
        >
          <Search size={18} aria-hidden className="shrink-0 text-hint" />
          <TextInput
            autoFocus
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="닉네임, 화면 이름을 입력해 보세요"
            role="combobox"
            aria-expanded
            aria-controls="palette-results"
            aria-activedescendant={activeItem ? `palette-${activeItem.id}` : undefined}
            className="h-auto border-0 bg-transparent px-0 text-body2 focus:ring-0"
          />
          <Kbd>esc</Kbd>
        </HStack>
        <VStack
          id="palette-results"
          role="listbox"
          aria-label="빠른 이동 결과"
          className="min-h-0 flex-1 overflow-y-auto px-075 py-050"
        >
          {searching ? <PaletteMessage title="찾는 중" /> : null}
          {noResult ? (
            <PaletteMessage title="찾는 결과가 없습니다" hint="닉네임, 화면 이름을 입력해 보세요" />
          ) : null}
          {shownGroups.map((group) => (
            <VStack
              key={group.label}
              gap="025"
              role="group"
              aria-label={group.label}
              className="px-100 py-075"
            >
              <Text typography="body4" weight="bold" foreground="hint" className="px-025 pb-050">
                {group.label}
              </Text>
              {group.items.map((item) => (
                <PaletteRow
                  key={item.id}
                  item={item}
                  active={item === activeItem}
                  onHover={() => setActiveIndex(items.indexOf(item))}
                  onSelect={close}
                />
              ))}
            </VStack>
          ))}
        </VStack>
        <PaletteFooter />
      </Dialog.Popup>
    </Dialog.Root>
  );
}
