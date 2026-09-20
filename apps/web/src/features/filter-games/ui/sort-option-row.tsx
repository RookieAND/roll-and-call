"use client";

import { Text } from "@trpg/ui";

import { SortRow } from "./sort-row";

export function SortOptionRow({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <SortRow selected={false} onSelect={onSelect}>
      <Text typography="body2" render={<span />}>
        {label}
      </Text>
    </SortRow>
  );
}
