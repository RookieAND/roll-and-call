"use client";

import { Dialog, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { PendingItem, UserSearchResult } from "@/shared/server";
import { Kbd, useServerPath } from "@/shared/ui";

import { searchPalette } from "../api/search-palette";
import { buildDefaultGroups } from "../model/build-default-groups";
import { buildSearchGroups } from "../model/build-search-groups";
import { usePaletteShortcuts } from "../model/use-palette-shortcuts";
import { useRecentScreens } from "../model/use-recent-screens";
import { PaletteFooter } from "./palette-footer";
import { PaletteMessage } from "./palette-message";
import { PaletteRow } from "./palette-row";

const SEARCH_DELAY = 150;

interface QuickSearchPaletteProps {
  pendingItemsPromise: Promise<PendingItem[]>;
  owner: boolean;
}

export function QuickSearchPalette({ pendingItemsPromise, owner }: QuickSearchPaletteProps) {
  const pendingItems = use(pendingItemsPromise);
  const router = useRouter();
  const toServerPath = useServerPath();
  const recentScreens = useRecentScreens();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const requestSequence = useRef(0);

  const openPalette = useCallback(() => setOpen(true), []);
  usePaletteShortcuts({ open: openPalette, pendingItems });

  // 늦게 온 이전 응답은 요청 순번으로 버린다. 찾는 동안에는 이전 결과를 지우고 Enter를 막는다(D187).
  useEffect(() => {
    if (!query.trim()) return;
    const sequence = ++requestSequence.current;
    const timer = setTimeout(async () => {
      const results = await searchPalette(query);
      if (sequence !== requestSequence.current) return;
      setUsers(results);
      setSearching(false);
    }, SEARCH_DELAY);
    return () => clearTimeout(timer);
  }, [query]);

  const trimmed = query.trim();
  const groups = trimmed
    ? buildSearchGroups({ query, users, owner })
    : buildDefaultGroups(pendingItems, recentScreens);
  const shownGroups = searching ? [] : groups;
  const items = shownGroups.flatMap((group) => group.items);
  const activeItem = items[Math.min(activeIndex, items.length - 1)];
  const noResult = Boolean(trimmed) && !searching && items.length === 0;

  const changeQuery = (value: string) => {
    requestSequence.current += 1;
    setQuery(value);
    setUsers([]);
    setSearching(Boolean(value.trim()));
    setActiveIndex(0);
  };

  const close = () => {
    setOpen(false);
    changeQuery("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + items.length) % items.length);
      return;
    }
    if (event.key !== "Enter" || !activeItem || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (event.metaKey || event.ctrlKey) window.open(toServerPath(activeItem.href), "_blank");
    else router.push(toServerPath(activeItem.href));
    close();
  };

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
