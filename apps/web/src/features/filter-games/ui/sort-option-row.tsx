"use client";

import { Text } from "@roll-and-call/ui";

import { SortRow } from "./sort-row";

interface SortOptionRowProps {
  label: string;
  onSelect: () => void;
}

export function SortOptionRow({ label, onSelect }: SortOptionRowProps) {
  return (
    <SortRow selected={false} onSelect={onSelect}>
      <Text typography="body2" render={<span />}>
        {label}
      </Text>
    </SortRow>
  );
}
