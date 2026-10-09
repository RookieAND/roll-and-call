import type { Metadata } from "next";

import { isNoShowStatus, parseSort, stringParams } from "@/shared/lib";
import {
  getNoShow,
  listNoShows,
  NO_SHOW_DEFAULT_SORT,
  NO_SHOW_SORT_COLUMNS,
  searchNoShowSessions,
} from "@/shared/server";
import { NoShowsView } from "@/views/no-shows";

export const metadata: Metadata = { title: "불참 기록" };

export default async function NoShowsPage({ searchParams }: PageProps<"/[server]/noshow">) {
  const params = await searchParams;
  const query = stringParams(params);
  const { q, status, record, page, pin, add, sq } = query;
  const sort = parseSort({
    searchParams: params,
    columns: NO_SHOW_SORT_COLUMNS,
    fallback: NO_SHOW_DEFAULT_SORT,
  });
  const rows = await listNoShows({
    query: q,
    status: isNoShowStatus(status) ? status : undefined,
    sort,
    pinId: pin,
  });
  const detail = record ? await getNoShow(record) : null;
  const addSearch = add ? await searchNoShowSessions(sq) : null;
  return (
    <NoShowsView
      rows={rows}
      record={detail}
      addSearch={addSearch}
      page={page}
      sort={sort}
      query={query}
      filtered={Boolean(q || status)}
    />
  );
}
