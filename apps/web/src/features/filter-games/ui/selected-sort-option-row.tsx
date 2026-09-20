"use client";

import { Text } from "@trpg/ui";
import { Check } from "lucide-react";

import { SortRow } from "./sort-row";

interface SelectedSortOptionRowProps {
  label: string;
  onSelect: () => void;
}

export function SelectedSortOptionRow({ label, onSelect }: SelectedSortOptionRowProps) {
  return (
    <SortRow selected onSelect={onSelect}>
      <Text typography="subtitle1" render={<span />}>
        {label}
      </Text>
      <Check size={16} className="text-primary-600" aria-hidden />
    </SortRow>
  );
}
