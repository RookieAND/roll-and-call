"use client";

import { Button, Checkbox, HStack, Sheet, Text, TextInput, VStack, cn } from "@roll-and-call/ui";
import { compact } from "es-toolkit";
import { useState } from "react";

import type { GrantOptions } from "@/entities/cert/server";

import { grantMemberPlan } from "../model/grant-candidate-status";
import { grantMemberText } from "../model/grant-candidate-text";
import { searchGrantMembers } from "../model/search-grant-members";
import { MobilePickTrigger } from "./mobile-pick-trigger";

interface MobileGrantMemberSheetProps {
  options: GrantOptions;
  books: GrantOptions["books"];
  selectedIds: string[];
  disabled: boolean;
  onChange: (selectedIds: string[]) => void;
}

// 화면에는 고른 칩과 [유저 찾기] 한 줄만 두고, 찾기와 고르기는 시트에서 한다.
export function MobileGrantMemberSheet({
  options,
  books,
  selectedIds,
  disabled,
  onChange,
}: MobileGrantMemberSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selectedIds);
  const [query, setQuery] = useState("");
  const found = searchGrantMembers({ members: options.members, query, excludeIds: [] });
  const toggle = (memberId: string, checked: boolean) =>
    setDraft(checked ? [...draft, memberId] : draft.filter((id) => id !== memberId));

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) return;
        setDraft(selectedIds);
        setQuery("");
      }}
    >
      <MobilePickTrigger
        label={selectedIds.length > 0 ? "유저 더 찾기" : "유저 찾기"}
        description="닉네임이나 디스코드 ID로 찾습니다"
        disabled={disabled}
      />
      <Sheet.Popup className="px-200 pt-100">
        <Sheet.Handle />
        <Sheet.Title className="text-heading3">인증할 유저 고르기</Sheet.Title>
        <VStack gap="100" className="min-h-0">
          <TextInput
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="닉네임 또는 디스코드 ID"
            aria-label="닉네임 또는 디스코드 ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {found.length > 0 ? (
            <VStack
              render={<ul aria-label="인증할 유저" />}
              className="max-h-75 overflow-y-auto rounded-600 border border-gray-200 bg-surface"
            >
              {found.map((member) => {
                const plan = grantMemberPlan({ userId: member.id, books, options });
                const locked = plan.statuses.length > 0 && plan.grantable.length === 0;
                const checked = draft.includes(member.id);
                const meta = compact([`@${member.discordHandle}`, grantMemberText(plan)]).join(
                  " · ",
                );
                return (
                  <li
                    key={member.id}
                    className={cn(
                      "border-t border-(--rc-color-border-subtle) px-150 first:border-t-0",
                      checked && "bg-tinted-bg",
                      locked && "opacity-50",
                    )}
                  >
                    <Checkbox.Field className="min-h-14 w-full gap-150">
                      <Checkbox.Root
                        checked={checked}
                        disabled={locked}
                        onCheckedChange={(next) => toggle(member.id, next)}
                      >
                        <Checkbox.Indicator />
                      </Checkbox.Root>
                      <Checkbox.Label className="flex-1 py-100">
                        <VStack render={<span />}>
                          <Text typography="body3" weight="bold">
                            {member.nickname}
                          </Text>
                          <Text typography="body4" foreground="hint">
                            {meta}
                          </Text>
                        </VStack>
                      </Checkbox.Label>
                    </Checkbox.Field>
                  </li>
                );
              })}
            </VStack>
          ) : null}
          {found.length === 0 && query.trim() !== "" ? (
            <Text typography="body4" foreground="hint" className="px-050">
              검색한 유저가 없습니다.
            </Text>
          ) : null}
        </VStack>
        <Sheet.Footer>
          <HStack gap="100">
            <Sheet.Close
              render={<Button variant="outline" colorPalette="gray" className="min-h-12 flex-1" />}
            >
              취소
            </Sheet.Close>
            <Button
              className="min-h-12 flex-1"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              {`${draft.length}명 선택`}
            </Button>
          </HStack>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
