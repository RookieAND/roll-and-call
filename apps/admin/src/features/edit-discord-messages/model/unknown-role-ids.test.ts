import { expect, it } from "vitest";

import { unknownRoleIds } from "./unknown-role-ids";

it("서버에 없는 역할 ID만 돌려준다", () => {
  expect(unknownRoleIds({ text: "<@&1> <@&2> {룰}", guildRoleIds: ["1"] })).toEqual(["2"]);
});
