import { isNull } from "es-toolkit";

export const BULK_SELECTION_STORAGE_KEY = "rc:bulk-cert-selection";
const MAX_AGE_MS = 30 * 60 * 1000;

interface ParseInput {
  raw: string | null;
  now: number;
}

// 사진 단계에서 뒤로 돌아와도 고른 책이 남도록 브라우저 탭에 잠깐 저장한다. 오래된 값은 버린다.
export function serializeBulkSelection({ ids, now }: { ids: readonly string[]; now: number }) {
  return JSON.stringify({ ids, savedAt: now });
}

export function parseBulkSelection({ raw, now }: ParseInput): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || isNull(parsed)) return [];
    const { ids, savedAt } = parsed as { ids?: unknown; savedAt?: unknown };
    if (typeof savedAt !== "number" || now - savedAt > MAX_AGE_MS) return [];
    if (!Array.isArray(ids)) return [];
    return ids.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}
