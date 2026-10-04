import { Chip, HStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { hasGameFilters, type GamesFilter } from "@/shared/api";
import { ServerLink } from "@/shared/ui";

import { CHIP_HIT_AREA } from "../lib/chip-hit-area";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import { appliedFilterChips } from "../model/applied-filter-chips";

interface AppliedFilterChipsProps {
  filter: GamesFilter;
  ruleOptions: { key: string; label: string }[];
}

export function AppliedFilterChips({ filter, ruleOptions }: AppliedFilterChipsProps) {
  if (!hasGameFilters(filter)) return null;
  return (
    <HStack
      gap="075"
      render={<nav aria-label="적용한 필터" />}
      className="-my-075 overflow-x-auto py-075 [scrollbar-width:none]"
    >
      {appliedFilterChips({ filter, ruleOptions }).map((chip) => (
        <Chip
          key={chip.key}
          selected
          render={
            <ServerLink
              path={gamesHref(filterParams({ ...chip.filter, page: undefined }))}
              aria-label={`${chip.label} 필터 빼기`}
            />
          }
          className={CHIP_HIT_AREA}
        >
          {chip.label}
          <X size={14} strokeWidth={2.4} aria-hidden />
        </Chip>
      ))}
    </HStack>
  );
}
