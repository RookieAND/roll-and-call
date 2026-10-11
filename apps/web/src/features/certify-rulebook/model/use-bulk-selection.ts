"use client";

import { useEffect, useState } from "react";

import type { MyRulebook } from "@/entities/rulebook";

import { pruneBulkSelection, toggleBulkSelection } from "./bulk-selection";
import {
  BULK_SELECTION_STORAGE_KEY,
  parseBulkSelection,
  serializeBulkSelection,
} from "./bulk-selection-storage";

interface UseBulkSelectionInput {
  rulebooks: MyRulebook[];
  bulk: boolean;
  onRestore: () => void;
}

export function useBulkSelection({ rulebooks, bulk, onRestore }: UseBulkSelectionInput) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BULK_SELECTION_STORAGE_KEY);
      const ids = pruneBulkSelection({
        rulebooks,
        selectedIds: parseBulkSelection({ raw, now: Date.now() }),
      });
      if (ids.length > 0) {
        onRestore();
        setSelectedIds(ids);
      }
    } catch {}
    setRestored(true);
    // 처음 한 번만 복원한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      if (bulk && selectedIds.length > 0) {
        sessionStorage.setItem(
          BULK_SELECTION_STORAGE_KEY,
          serializeBulkSelection({ ids: selectedIds, now: Date.now() }),
        );
      } else {
        sessionStorage.removeItem(BULK_SELECTION_STORAGE_KEY);
      }
    } catch {}
  }, [restored, bulk, selectedIds]);

  const clear = () => setSelectedIds([]);

  const toggle = (rulebookId: string) =>
    setSelectedIds((current) =>
      toggleBulkSelection({ rulebooks, selectedIds: current, rulebookId }),
    );

  return { selectedIds, clear, toggle };
}
