"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { PendingItem, UserSearchResult } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { searchPalette } from "../api/search-palette";
import { buildDefaultGroups } from "./build-default-groups";
import { buildSearchGroups } from "./build-search-groups";
import { usePaletteShortcuts } from "./use-palette-shortcuts";
import { useRecentScreens } from "./use-recent-screens";

const SEARCH_DELAY = 150;

interface UseQuickSearchOptions {
  pendingItems: PendingItem[];
  owner: boolean;
}

export function useQuickSearch({ pendingItems, owner }: UseQuickSearchOptions) {
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

  return {
    open,
    setOpen,
    query,
    trimmed,
    searching,
    noResult,
    shownGroups,
    items,
    activeItem,
    setActiveIndex,
    changeQuery,
    close,
    onKeyDown,
  };
}
