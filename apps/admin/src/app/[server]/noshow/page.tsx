import type { Metadata } from "next";

import { isNoShowStatus, NO_SHOW_DEFAULT_SORT, NO_SHOW_SORT_COLUMNS } from "@/entities/no-show";
import { getNoShow, listNoShows, searchNoShowSessions } from "@/entities/no-show/server";
import { parseSort, stringParams } from "@/shared/lib";
import { NoShowsMobileView, NoShowsView } from "@/views/no-shows";

export const metadata: Metadata = { title: "불참 기록" };

export default async function NoShowsPage({ searchParams }: PageProps<"/[server]/noshow">) {
  const params = await searchParams;
  const query = stringParams(params);
  const { q, status, record, page, pin, add, sq, detail } = query;
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
  const recordDetail = record ? await getNoShow(record) : null;
  // 모바일은 기록을 시트 대신 상세 화면으로 연다(?detail=).
  const mobileDetail = detail ? await getNoShow(detail) : null;
  const addSearch = add ? await searchNoShowSessions(sq) : null;
  const filtered = Boolean(q || status);
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <NoShowsView
          rows={rows}
          record={recordDetail}
          addSearch={addSearch}
          page={page}
          sort={sort}
          query={query}
          filtered={filtered}
        />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <NoShowsMobileView
          rows={rows}
          detail={mobileDetail}
          sort={sort}
          query={query}
          filtered={filtered}
        />
      </div>
    </>
  );
}
