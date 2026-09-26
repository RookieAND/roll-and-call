import { describe, expect, it } from "vitest";

import { categoryEditions } from "./category-editions";
import type { RulebookRow } from "./list-rulebooks";

const book = (id: string, edition: string, overrides: Partial<RulebookRow> = {}) =>
  ({ id, edition, kind: "core", certRequired: true, ...overrides }) as RulebookRow;

describe("categoryEditions", () => {
  it("판본마다 필요한 기본 룰북과 대신하는 신판을 모은다", () => {
    const [sixth, seventh] = categoryEditions([
      book("6", "6판"),
      book("7", "7판", { supersedesEdition: "6판" }),
      book("pulp", "7판", { kind: "supplement" }),
    ]);
    expect(sixth).toMatchObject({ edition: "6판", free: false });
    expect(sixth!.required.map((row) => row.id)).toEqual(["6"]);
    expect(sixth!.alternatives.map((row) => row.id)).toEqual(["7"]);
    expect(seventh!.books.map((row) => row.id)).toEqual(["7", "pulp"]);
  });

  it("기본 룰북이 모두 무료면 인증 없이 GM", () => {
    const [edition] = categoryEditions([book("f", "F", { certRequired: false })]);
    expect(edition!.free).toBe(true);
  });
});
