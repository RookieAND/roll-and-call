"use client";

import { TextInput, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import type { GrantOptions } from "@/shared/server";

import { grantCandidateStatus } from "../model/grant-candidate-status";
import { searchGrantMembers } from "../model/search-grant-members";
import { GrantMemberRow } from "./grant-member-row";

interface GrantMemberPickerProps {
  options: GrantOptions;
  book: GrantOptions["books"][number] | undefined;
  selectedIds: string[];
  disabled: boolean;
  onChange: (selectedIds: string[]) => void;
}

// 고른 사람은 검색어와 상관없이 목록 위에 남는다. 검색 결과는 이 서버 멤버 중 20명까지다.
export function GrantMemberPicker({
  options,
  book,
  selectedIds,
  disabled,
  onChange,
}: GrantMemberPickerProps) {
  const [query, setQuery] = useState("");
  const selected = options.members.filter((member) => selectedIds.includes(member.id));
  const found = searchGrantMembers({ members: options.members, query, excludeIds: selectedIds });
  const rows = [...selected, ...found];
  const toggle = (memberId: string, checked: boolean) =>
    onChange(checked ? [...selectedIds, memberId] : selectedIds.filter((id) => id !== memberId));

  return (
    <VStack gap="100">
      <TextInput
        type="search"
        placeholder="닉네임 또는 디스코드 ID"
        aria-label="닉네임 또는 디스코드 ID"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {rows.length > 0 ? (
        <ul
          aria-label="인증할 유저"
          className="overflow-hidden rounded-400 border border-gray-200 bg-surface"
        >
          {rows.map((member) => (
            <GrantMemberRow
              key={member.id}
              member={member}
              status={book ? grantCandidateStatus({ userId: member.id, book, options }) : null}
              checked={selectedIds.includes(member.id)}
              disabled={disabled}
              onCheckedChange={(checked) => toggle(member.id, checked)}
            />
          ))}
        </ul>
      ) : null}
    </VStack>
  );
}
