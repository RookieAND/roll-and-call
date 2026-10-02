import { describe, expect, it } from "vitest";

import type { MyServer } from "@/shared/server";

import { filterServers } from "./filter-servers";
import { SERVER_FILTER } from "./server-filter";

const server = (slug: string, overrides: Partial<MyServer> = {}): MyServer => ({
  id: slug,
  slug,
  name: slug.toUpperCase(),
  icon: null,
  role: "owner",
  botConnected: true,
  members: 0,
  pending: 0,
  certPending: 0,
  ...overrides,
});

describe("filterServers", () => {
  const servers = [
    server("trpia", { pending: 3 }),
    server("canvas", { botConnected: false }),
    server("moonlit"),
  ];

  it("이름이나 slug로 찾는다", () => {
    expect(
      filterServers({ servers, query: "Can", filter: undefined }).map((found) => found.slug),
    ).toEqual(["canvas"]);
  });

  it("봇 연결 끊김과 처리 대기 있음으로 거른다", () => {
    expect(
      filterServers({ servers, query: "", filter: SERVER_FILTER.bot }).map((found) => found.slug),
    ).toEqual(["canvas"]);
    expect(
      filterServers({ servers, query: "", filter: SERVER_FILTER.pending }).map(
        (found) => found.slug,
      ),
    ).toEqual(["trpia"]);
  });
});
