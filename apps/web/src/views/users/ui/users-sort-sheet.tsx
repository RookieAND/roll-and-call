"use client";

import { Button, Sheet } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useServerPath } from "@/shared/lib";

import { USER_SORTS } from "../model/user-sort";
import type { UsersFilter } from "../model/users-filter";
import { usersHref } from "../model/users-href";
import { SheetRadioItem } from "./sheet-radio-item";

interface UsersSortSheetProps {
  filter: UsersFilter;
}

export function UsersSortSheet({ filter }: UsersSortSheetProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentLabel = USER_SORTS.find((option) => option.key === filter.sort)!.label;

  function select(sort: UsersFilter["sort"]) {
    setOpen(false);
    if (sort !== filter.sort) router.push(toServerPath(usersHref({ ...filter, sort })));
  }

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        render={<Button variant="ghost" size="sm" aria-label={`정렬: ${currentLabel}`} />}
      >
        {currentLabel}
        <ChevronDown size={14} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-100">정렬</Sheet.Title>
        <div role="radiogroup" aria-label="정렬">
          {USER_SORTS.map((option) => (
            <SheetRadioItem
              key={option.key}
              selected={filter.sort === option.key}
              onSelect={() => select(option.key)}
            >
              {option.label}
            </SheetRadioItem>
          ))}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
