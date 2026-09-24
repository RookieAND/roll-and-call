"use client";

import { Dialog, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type KeyboardEvent } from "react";

import type { PendingItem, UserSearchResult } from "@/shared/server";
import { Kbd } from "@/shared/ui";

import { searchPalette } from "../api/search-palette";
import { buildDefaultGroups } from "../model/build-default-groups";
import { buildSearchGroups } from "../model/build-search-groups";
import { usePaletteShortcuts } from "../model/use-palette-shortcuts";
import { useRecentScreens } from "../model/use-recent-screens";
import { PaletteFooter } from "./palette-footer";
import { PaletteRow } from "./palette-row";

const SEARCH_DELAY = 150;

interface QuickSearchPaletteProps {
  pendingItems: PendingItem[];
}

export function QuickSearchPalette({ pendingItems }: QuickSearchPaletteProps) {
  const router = useRouter();
  const recentScreens = useRecentScreens();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPalette = useCallback(() => setOpen(true), []);
  usePaletteShortcuts(openPalette);

  useEffect(() => {
    if (!query.trim()) return;
    let stale = false;
    const timer = setTimeout(async () => {
      const results = await searchPalette(query);
      if (!stale) setUsers(results);
    }, SEARCH_DELAY);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query]);

  const groups = query.trim()
    ? buildSearchGroups(query, users)
    : buildDefaultGroups(pendingItems, recentScreens);
  const items = groups.flatMap((group) => group.items);
  const activeItem = items[Math.min(activeIndex, items.length - 1)];

  const close = () => {
    setOpen(false);
    setQuery("");
    setUsers([]);
    setActiveIndex(0);
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
    if (event.metaKey || event.ctrlKey) window.open(activeItem.href, "_blank");
    else router.push(activeItem.href);
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
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="닉네임, 세션, 룰북, 화면 이름을 입력해 보세요"
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
          {items.length === 0 ? (
            <Text typography="body3" foreground="hint" className="px-125 py-300 text-center">
              찾는 결과가 없습니다
            </Text>
          ) : null}
          {groups.map((group) => (
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
