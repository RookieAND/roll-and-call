import { describe, expect, it } from "vitest";

import type { CertApplication } from "@/shared/server";

import type { CertQueueRow } from "./cert-queue-rows";
import { mergeGroupRows } from "./merge-group-rows";

const row = (id: string, kind: CertQueueRow["kind"]) =>
  ({ id, kind, rulebook: id, category: "", groupCount: 1 }) as CertQueueRow;
const application = (id: string, groupId: string | null) => ({ id, groupId }) as CertApplication;

describe("mergeGroupRows", () => {
  it("같은 묶음은 한 줄로 합치고 권수를 센다", () => {
    const merged = mergeGroupRows({
      rows: [row("a", "core"), row("b", "supplement"), row("c", "core")],
      applications: [application("a", "g"), application("b", "g"), application("c", null)],
    });
    expect(merged.map((item) => [item.id, item.groupCount])).toEqual([
      ["a", 2],
      ["c", 1],
    ]);
  });

  it("묶음의 대표는 기본 룰북이 앞선다", () => {
    const merged = mergeGroupRows({
      rows: [row("s", "supplement"), row("k", "core")],
      applications: [application("s", "g"), application("k", "g")],
    });
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ id: "k", groupCount: 2 });
  });
});
