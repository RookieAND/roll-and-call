import type { CertManageList } from "@/entities/cert/server";
import { EMPTY_IMAGE, EmptyState, InfiniteList } from "@/shared/ui";

import { CertManageMobileRow } from "./cert-manage-mobile-row";

interface CertManageMobileRowsProps {
  list: CertManageList;
}

export function CertManageMobileRows({ list }: CertManageMobileRowsProps) {
  if (list.total === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.myGames}
        title="아직 인증 기록이 없습니다"
        description="GM이 룰북 인증을 신청하거나 운영진이 인증을 부여하면 이곳에 표시됩니다."
      />
    );
  }
  if (list.rows.length === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.search}
        title="조건에 맞는 인증이 없습니다"
        description="검색어나 상태를 바꿔 보세요."
      />
    );
  }
  return (
    <InfiniteList>
      {list.rows.map((row) => (
        <CertManageMobileRow key={row.key} row={row} />
      ))}
    </InfiniteList>
  );
}
