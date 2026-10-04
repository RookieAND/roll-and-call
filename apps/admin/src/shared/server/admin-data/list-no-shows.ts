import "server-only";
import { selectNoShowRows, type NoShowFilter } from "./select-no-show-rows";
import { loadSnapshot } from "./snapshot";
import { toNoShowRow } from "./to-no-show-row";

export async function listNoShows(filter: NoShowFilter) {
  const db = await loadSnapshot();
  const now = Date.now();
  const rows = db.noShows.map((noShow) => toNoShowRow({ db, noShow, now }));
  return selectNoShowRows({ rows, ...filter });
}
