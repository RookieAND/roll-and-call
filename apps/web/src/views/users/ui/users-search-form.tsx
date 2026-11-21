"use client";

import { HStack, IconButton, TextInput } from "@roll-and-call/ui";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useServerPath } from "@/shared/lib";
import { useDebouncedValue } from "@/shared/ui";

import type { UsersFilter } from "../model/users-filter";
import { usersHref } from "../model/users-href";

const SEARCH_DELAY_MS = 300;

interface UsersSearchFormProps {
  filter: UsersFilter;
}

// 입력이 멈추고 300ms 뒤에 주소에 반영한다. 주소가 바깥(빈 화면의 [검색어 지우기])에서 바뀌면 입력창도 맞춘다.
export function UsersSearchForm({ filter }: UsersSearchFormProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [value, setValue] = useState(filter.q ?? "");
  const debounced = useDebouncedValue({ value: value.trim(), delay: SEARCH_DELAY_MS });
  const appliedRef = useRef(filter.q ?? "");

  useEffect(() => {
    if (debounced === appliedRef.current) return;
    appliedRef.current = debounced;
    router.replace(toServerPath(usersHref({ ...filter, q: debounced || undefined })));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 입력이 멈출 때만 보낸다
  }, [debounced]);

  useEffect(() => {
    if ((filter.q ?? "") !== appliedRef.current) {
      appliedRef.current = filter.q ?? "";
      setValue(filter.q ?? "");
    }
  }, [filter.q]);

  return (
    <form
      role="search"
      className="relative min-w-0 flex-1"
      onSubmit={(event) => event.preventDefault()}
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
        placeholder="닉네임으로 찾기"
        aria-label="닉네임으로 찾기"
        enterKeyHint="search"
        className="pl-9 pr-11"
      />
      <HStack align="center" className="absolute inset-y-0 right-0">
        {value && (
          <IconButton
            variant="ghost"
            aria-label="검색어 지우기"
            className="h-11 w-11"
            onClick={() => setValue("")}
          >
            <X size={16} aria-hidden />
          </IconButton>
        )}
      </HStack>
    </form>
  );
}
