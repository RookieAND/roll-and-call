import "server-only";
import { uniq } from "es-toolkit";

import { POST_STATUS } from "@/shared/lib";
import { loadAdminData } from "@/shared/server";

import { selectPostRows, type PostListFilter } from "../model/select-post-rows";
import { toPostRow } from "../model/to-post-row";

export async function listPosts(filter: PostListFilter) {
  const db = await loadAdminData(["users", "sessions"]);
  const nicknames = new Map(db.users.map((user) => [user.id, user.nickname]));
  const all = db.sessions.map((session) => toPostRow({ nicknames, session }));
  return {
    total: all.length,
    rows: selectPostRows({ rows: all, ...filter }),
    statusOptions: Object.values(POST_STATUS),
    rulebookOptions: uniq(all.map((row) => row.rulebook)).toSorted(),
  };
}
