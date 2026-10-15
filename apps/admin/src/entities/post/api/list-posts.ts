import "server-only";
import { uniq } from "es-toolkit";

import { POST_STATUS } from "@/shared/lib";
import { loadSnapshot } from "@/shared/server";

import { selectPostRows, type PostListFilter } from "../model/select-post-rows";
import { toPostRow } from "../model/to-post-row";

export async function listPosts(filter: PostListFilter) {
  const db = await loadSnapshot();
  const all = db.sessions.map((session) => toPostRow({ db, session }));
  return {
    total: all.length,
    rows: selectPostRows({ rows: all, ...filter }),
    statusOptions: Object.values(POST_STATUS),
    rulebookOptions: uniq(all.map((row) => row.rulebook)).toSorted(),
  };
}
