import type { CertManageFilter } from "./cert-manage-filter";
import type { CertManageRow } from "./cert-manage-row";

// 검색은 닉네임·디스코드 핸들·디스코드 ID를 대소문자 없이 부분 일치로 찾는다.
export function filterCertManage({
  rows,
  filter,
}: {
  rows: CertManageRow[];
  filter: CertManageFilter;
}) {
  const keyword = filter.query?.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!keyword ||
        [row.nickname, row.discordHandle, row.discordId].some((value) =>
          value.toLowerCase().includes(keyword),
        )) &&
      (!filter.status || row.status === filter.status) &&
      (!filter.edition || row.edition === filter.edition) &&
      (!filter.userId || row.userId === filter.userId) &&
      (!filter.rulebookId || row.rulebookId === filter.rulebookId),
  );
}
