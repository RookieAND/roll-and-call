import { describe, expect, it } from "vitest";

import { parseBulkSelection, serializeBulkSelection } from "./bulk-selection-storage";

const NOW = 1_000_000;

describe("bulk selection storage", () => {
  it("저장한 값을 그대로 읽는다", () => {
    const raw = serializeBulkSelection({ ids: ["a", "b"], now: NOW });
    expect(parseBulkSelection({ raw, now: NOW + 1000 })).toEqual(["a", "b"]);
  });

  it("30분이 지난 값은 버린다", () => {
    const raw = serializeBulkSelection({ ids: ["a"], now: NOW });
    expect(parseBulkSelection({ raw, now: NOW + 31 * 60 * 1000 })).toEqual([]);
  });

  it("값이 없거나 깨졌으면 빈 목록이다", () => {
    expect(parseBulkSelection({ raw: null, now: NOW })).toEqual([]);
    expect(parseBulkSelection({ raw: "{", now: NOW })).toEqual([]);
    expect(parseBulkSelection({ raw: '{"ids":"a","savedAt":1}', now: NOW })).toEqual([]);
  });
});
