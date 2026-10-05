import { expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
process.env.DATABASE_URL ??= "postgres://user:pass@127.0.0.1:1/db";

it("룰북 → 분류 관계가 스키마에 등록돼 있다", async () => {
  const { db } = await import("./client");
  const query = db.query.games.findMany({
    with: { rulebook: { columns: {}, with: { category: { columns: { miniRule: true } } } } },
  });
  expect(query.toSQL().sql).toContain("mini_rule");
});
