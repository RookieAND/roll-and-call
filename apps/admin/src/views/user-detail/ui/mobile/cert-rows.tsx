import { Callout, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/entities/user/server";
import { EMPTY_IMAGE, EmptyState, InfiniteList, ListRow, Tag } from "@/shared/ui";

import { CERT_ROW_LABEL, CERT_ROW_STATE, toCertRows } from "../../model/to-cert-rows";

interface CertRowsProps {
  user: UserDetail;
}

export function CertRows({ user }: CertRowsProps) {
  const rows = toCertRows(user);
  return (
    <>
      {user.sanction ? (
        <VStack className="p-150">
          <Callout.Root colorPalette="warning">
            <Callout.Icon />
            <Callout.Title>제재 기간에는 구인을 개설할 수 없습니다</Callout.Title>
            <Callout.Description>
              인증된 룰북이 있어도 제재가 끝날 때까지 새 구인을 열 수 없습니다.
            </Callout.Description>
          </Callout.Root>
        </VStack>
      ) : null}
      {rows.length === 0 ? (
        <EmptyState
          image={EMPTY_IMAGE.myGames}
          title="룰북 인증 기록이 없습니다"
          description="인증을 신청하면 심사 결과가 이곳에 쌓입니다."
        />
      ) : (
        <InfiniteList unit="개">
          {rows.map((row) => {
            const state = CERT_ROW_LABEL[row.state];
            return (
              <ListRow
                key={row.key}
                path={row.action?.href ?? "/cert/manage"}
                title={row.rulebook}
                trailing={<Tag tone={state.tone}>{state.label}</Tag>}
                description={row.reason ? `사유: ${row.reason}` : null}
                meta={row.staff ? `${row.date} · ${row.staff}` : row.date}
                muted={row.state === CERT_ROW_STATE.rejected}
              />
            );
          })}
        </InfiniteList>
      )}
    </>
  );
}
