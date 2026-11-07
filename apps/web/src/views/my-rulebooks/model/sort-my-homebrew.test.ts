import {
  HOMEBREW_APPLICATION_STATUS,
  type HomebrewApplicationStatus,
} from "@roll-and-call/database/homebrew/model";
import { expect, test } from "vitest";

import { sortMyHomebrew } from "./sort-my-homebrew";

const row = (id: string, status: HomebrewApplicationStatus, day: number) => ({
  id,
  status,
  createdAt: new Date(2026, 10, day),
});

test("승인됨, 심사 중, 반려됨 순서이고 같은 상태 안에서는 늦은 신청이 위다", () => {
  const sorted = sortMyHomebrew([
    row("rejected-old", HOMEBREW_APPLICATION_STATUS.rejected, 1),
    row("pending", HOMEBREW_APPLICATION_STATUS.pending, 5),
    row("approved-old", HOMEBREW_APPLICATION_STATUS.approved, 2),
    row("rejected-new", HOMEBREW_APPLICATION_STATUS.rejected, 6),
    row("approved-new", HOMEBREW_APPLICATION_STATUS.approved, 4),
  ]);
  expect(sorted.map(({ id }) => id)).toEqual([
    "approved-new",
    "approved-old",
    "pending",
    "rejected-new",
    "rejected-old",
  ]);
});
