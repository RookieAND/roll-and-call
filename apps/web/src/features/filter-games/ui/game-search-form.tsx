"use client";

import { IconButton, TextInput } from "@trpg/ui";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { GamesFilter } from "@/shared/api";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

export function GameSearchForm({ filter }: { filter: GamesFilter }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(filter.q ?? "");

  // 뒤로가기·칩 이동 등으로 주소의 q가 바뀌면 입력값도 따라간다.
  useEffect(() => setValue(filter.q ?? ""), [filter.q]);

  function search(query: string) {
    startTransition(() => {
      router.push(gamesHref(filterParams({ ...filter, q: query || undefined })));
    });
  }

  function clear() {
    setValue("");
    if (filter.q) search("");
  }

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        search(value.trim());
      }}
    >
      <TextInput
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="게임명 검색"
        aria-label="게임명 검색"
        enterKeyHint="search"
        className="pr-11"
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        {pending ? (
          <Loader2 size={16} className="mr-3.5 animate-spin text-hint" aria-label="검색 중" />
        ) : (
          value && (
            <IconButton
              variant="ghost"
              aria-label="검색어 지우기"
              className="h-11 w-11"
              onClick={clear}
            >
              <X size={16} aria-hidden />
            </IconButton>
          )
        )}
      </div>
    </form>
  );
}
