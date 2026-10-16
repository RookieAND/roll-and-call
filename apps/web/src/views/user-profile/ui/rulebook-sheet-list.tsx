"use client";

import { Sheet, Text, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { useState } from "react";

import { groupRulebooksByInitial } from "../model/group-rulebooks-by-initial";

interface RulebookSheetListProps {
  rulebooks: { id: string; label: string }[];
}

// 인증한 룰북 전체를 이름으로 찾고, 초성 머리글로 묶어 보인다.
export function RulebookSheetList({ rulebooks }: RulebookSheetListProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const matched = keyword
    ? rulebooks.filter((rulebook) => rulebook.label.toLowerCase().includes(keyword))
    : rulebooks;
  const groups = groupRulebooksByInitial(matched);

  return (
    <>
      <div className="relative px-200 pt-050 pb-150">
        <Search
          size={16}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-300 z-10 -translate-y-1/2 text-hint"
        />
        <TextInput
          type="search"
          value={query}
          placeholder="룰북 이름 검색"
          aria-label="인증한 룰북 검색"
          enterKeyHint="search"
          onChange={(event) => setQuery(event.target.value)}
          className="pl-500"
        />
      </div>
      <Sheet.Body className="border-t border-gray-200 px-200 pb-200">
        {groups.length === 0 && (
          <Text typography="body3" foreground="hint" render={<p />} className="py-200">
            찾는 룰북이 없습니다
          </Text>
        )}
        {groups.map((group) => (
          <section key={group.label}>
            <h3 className="sticky top-0 z-10 flex items-center gap-100 bg-surface pt-150 pb-075 text-body4 font-extrabold text-primary-ink">
              {group.label}
              <Text typography="body4" foreground="hint" numeric render={<span />}>
                {group.items.length}
              </Text>
            </h3>
            {group.items.map((rulebook) => (
              <Text
                key={rulebook.id}
                typography="body2"
                weight="medium"
                render={<div />}
                className="flex min-h-11 items-center border-t border-gray-200 first:border-t-0"
              >
                {rulebook.label}
              </Text>
            ))}
          </section>
        ))}
      </Sheet.Body>
    </>
  );
}
