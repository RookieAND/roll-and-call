import "server-only";
import { loadAdminData } from "@/shared/server";

import { selectNoShowRows, type NoShowFilter } from "../model/select-no-show-rows";
import { toNoShowRow } from "../model/to-no-show-row";

export async function listNoShows(filter: NoShowFilter) {
  const db = await loadAdminData(["users", "sessions", "noShows"]);
  const now = Date.now();
  const rows = db.noShows.map((noShow) => toNoShowRow({ db, noShow, now }));
  return selectNoShowRows({ rows, ...filter });
}
