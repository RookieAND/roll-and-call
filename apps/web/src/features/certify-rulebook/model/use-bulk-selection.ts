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
  onRestore: () => void;
}

export function useBulkSelection({ rulebooks, onRestore }: UseBulkSelectionInput) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 사진 단계에서 뒤로 돌아온 경우에만 한 번 복원한다. 읽은 값은 바로 지워 다시 들어올 때는 비어 있게 한다.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BULK_SELECTION_STORAGE_KEY);
      sessionStorage.removeItem(BULK_SELECTION_STORAGE_KEY);
      const ids = pruneBulkSelection({
        rulebooks,
        selectedIds: parseBulkSelection({ raw, now: Date.now() }),
      });
      if (ids.length > 0) {
        onRestore();
        setSelectedIds(ids);
      }
    } catch {}
    // 처음 한 번만 복원한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => setSelectedIds([]);

  const toggle = (rulebookId: string) =>
    setSelectedIds((current) =>
      toggleBulkSelection({ rulebooks, selectedIds: current, rulebookId }),
    );

  const persist = () => {
    try {
      sessionStorage.setItem(
        BULK_SELECTION_STORAGE_KEY,
        serializeBulkSelection({ ids: selectedIds, now: Date.now() }),
      );
    } catch {}
  };

  return { selectedIds, clear, toggle, persist };
}
