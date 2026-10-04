"use client";

import { HStack, IconButton, TextInput } from "@roll-and-call/ui";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { GamesFilter } from "@/shared/api";
import { useServerPath } from "@/shared/lib";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameSearchFormProps {
  filter: GamesFilter;
}

export function GameSearchForm({ filter }: GameSearchFormProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(filter.q ?? "");

  const searchLabel = pending ? "검색 중" : "구인 제목·룰 검색";

  function search(query: string) {
    startTransition(() => {
      router.push(toServerPath(gamesHref(filterParams({ ...filter, q: query || undefined }))));
    });
  }

  function clear() {
    setValue("");
    if (filter.q) search("");
  }

  return (
    <form
      role="search"
      className="relative min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        search(value.trim());
      }}
    >
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-150 z-10 -translate-y-1/2 text-hint"
      />
      <TextInput
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="구인 제목·룰 검색"
        aria-label={searchLabel}
        aria-busy={pending}
        enterKeyHint="search"
        className="pl-9 pr-11"
      />
      <HStack align="center" className="absolute inset-y-0 right-0">
        {value && (
          <IconButton
            variant="ghost"
            aria-label="검색어 지우기"
            className="h-11 w-11"
            onClick={clear}
          >
            <X size={16} aria-hidden />
          </IconButton>
        )}
      </HStack>
    </form>
  );
}
