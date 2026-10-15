"use client";

import { Button, Dialog, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import type { MouseEvent } from "react";

import { EMPTY_IMAGE, EmptyState, ListRow, NAV_ITEMS, ServerLink } from "@/shared/ui";

import type { useQuickSearch } from "../model/use-quick-search";
import { MobileSearchLoading } from "./mobile-search-loading";

interface MobileQuickSearchProps {
  search: ReturnType<typeof useQuickSearch>;
  owner: boolean;
}

// 드로어의 [검색 · 이동]을 누르면 화면 전체가 검색 화면으로 바뀐다. 입력이 없으면 메뉴 이동 목록을 보인다.
export function MobileQuickSearch({ search, owner }: MobileQuickSearchProps) {
  const { open, setOpen, query, trimmed, searching, noResult, shownGroups, changeQuery, close } =
    search;
  const navItems = NAV_ITEMS.filter((item) => owner || !("ownerOnly" in item));
  // 줄마다 닫기 핸들러를 달지 않고, 목록 안의 링크를 누르면 닫는다.
  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) close();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <Dialog.Popup className="top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-canvas p-0 shadow-none break-keep">
        <Dialog.Title className="sr-only">빠른 이동</Dialog.Title>
        <HStack
          align="center"
          gap="100"
          className="h-14 shrink-0 border-b border-gray-200 bg-surface pr-100 pl-150"
        >
          <HStack align="center" className="relative min-w-0 flex-1">
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute left-150 text-hint"
            />
            <TextInput
              autoFocus
              type="search"
              enterKeyHint="search"
              inputMode="search"
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="닉네임, 화면 이름을 입력해 보세요"
              aria-label="닉네임, 화면 이름 검색"
              className="h-11 rounded-full pl-400 text-body3"
            />
          </HStack>
          <Button variant="ghost" colorPalette="gray" onClick={close} className="h-11">
            취소
          </Button>
        </HStack>
        <VStack className="min-h-0 flex-1 overflow-y-auto" onClick={closeOnLink}>
          {trimmed ? null : (
            <>
              <Text
                typography="body4"
                weight="bold"
                foreground="hint"
                className="px-200 pt-125 pb-050"
              >
                이동
              </Text>
              {navItems.map((item) => (
                <HStack
                  key={item.key}
                  align="center"
                  gap="125"
                  render={<ServerLink path={item.href} />}
                  className="min-h-13 border-b border-(--rc-color-border-subtle) bg-surface px-200 active:bg-gray-50"
                >
                  <item.icon size={20} aria-hidden />
                  <Text typography="body2" weight="medium">
                    {item.label}
                  </Text>
                </HStack>
              ))}
            </>
          )}
          {searching ? <MobileSearchLoading /> : null}
          {noResult ? (
            <EmptyState
              image={EMPTY_IMAGE.hosted}
              title="찾는 결과가 없습니다"
              description="닉네임, 화면 이름을 입력해 보세요"
              className="h-[420px]"
            />
          ) : null}
          {trimmed
            ? shownGroups.map((group) => (
                <VStack key={group.label} render={<section aria-label={group.label} />}>
                  <Text
                    typography="body4"
                    weight="bold"
                    foreground="hint"
                    className="px-200 pt-125 pb-050"
                  >
                    {group.label}
                  </Text>
                  {group.items.map((item) => (
                    <ListRow
                      key={item.id}
                      path={item.href}
                      title={item.title}
                      description={item.meta}
                    />
                  ))}
                </VStack>
              ))
            : null}
        </VStack>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
