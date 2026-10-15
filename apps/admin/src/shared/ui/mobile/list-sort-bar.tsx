"use client";

import { Button, HStack, RadioCard, RadioGroup, Sheet, Text } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { SortDir, TableSort } from "@/shared/lib";

export interface ListSortOption {
  label: string;
  column: string;
  dir: SortDir;
}

interface ListSortBarProps {
  // 「48건」처럼 단위까지 붙인 개수
  total: string;
  sort: Pick<TableSort, "column" | "dir">;
  options: ListSortOption[];
}

const keyOf = (option: Pick<ListSortOption, "column" | "dir">) => `${option.column}.${option.dir}`;

// 목록 위 정렬 줄. 표 머리글 정렬 대신 기준을 눌러 시트에서 고른다(sort·dir 주소 값은 데스크톱과 같다).
export function ListSortBar({ total, sort, options }: ListSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const current = options.find((option) => keyOf(option) === keyOf(sort)) ?? options[0];

  const choose = (key: string) => {
    const option = options.find((candidate) => keyOf(candidate) === key);
    if (!option) return;
    const next = new URLSearchParams(searchParams);
    next.set("sort", option.column);
    next.set("dir", option.dir);
    next.delete("page");
    setOpen(false);
    router.replace(`${pathname}?${next}`, { scroll: false });
  };

  return (
    <HStack
      align="center"
      justify="between"
      gap="100"
      className="min-h-11 border-b border-(--rc-color-border-subtle) bg-surface pr-100 pl-200"
    >
      <Text typography="body4" foreground="muted" numeric>
        {total}
      </Text>
      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Trigger
          render={
            <Button
              variant="ghost"
              colorPalette="gray"
              aria-label="정렬"
              className="min-h-11 gap-025 px-100 text-body4 font-bold text-gray-900"
            />
          }
        >
          {current?.label}
          <ChevronDown size={14} aria-hidden />
        </Sheet.Trigger>
        <Sheet.Popup>
          <Sheet.Handle />
          <Sheet.Title className="mb-150 text-heading3">정렬</Sheet.Title>
          <RadioGroup
            value={current ? keyOf(current) : undefined}
            onValueChange={(value) => choose(String(value))}
            className="flex flex-col gap-075"
          >
            {options.map((option) => (
              <RadioCard.Root key={keyOf(option)} value={keyOf(option)} className="min-h-12 py-075">
                <RadioCard.Title>{option.label}</RadioCard.Title>
                <RadioCard.Indicator />
              </RadioCard.Root>
            ))}
          </RadioGroup>
        </Sheet.Popup>
      </Sheet.Root>
    </HStack>
  );
}
