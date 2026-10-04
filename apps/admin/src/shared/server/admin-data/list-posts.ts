import "server-only";
import { uniq } from "es-toolkit";

import { POST_STATUS } from "./post-status";
import { selectPostRows, type PostListFilter } from "./select-post-rows";
import { loadSnapshot } from "./snapshot";
import { toPostRow } from "./to-post-row";

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
