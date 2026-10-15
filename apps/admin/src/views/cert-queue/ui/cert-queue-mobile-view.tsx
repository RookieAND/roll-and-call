import { Chip, HStack, VStack } from "@roll-and-call/ui";

import {
  CERT_QUEUE_FILTERS,
  CERT_TABS,
  type CertQueueFilter,
  type CertQueueFilterKey,
} from "@/entities/cert";
import { type listCertQueue } from "@/entities/cert/server";
import { SORT_DIR, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  ListSortBar,
  InfiniteList,
  RouteTabs,
  ServerLink,
  TabCount,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertQueueMobileRow } from "./mobile/cert-queue-mobile-row";

interface CertQueueMobileViewProps {
  queue: Awaited<ReturnType<typeof listCertQueue>>;
  filter: CertQueueFilter;
}

const FILTER_CHIPS = [
  { key: undefined, label: "전체" },
  ...(Object.entries(CERT_QUEUE_FILTERS) as [CertQueueFilterKey, string][]).map(([key, label]) => ({
    key,
    label,
  })),
];

// 대기열은 순서를 바꿀 수 없다(D200). 정렬 줄은 기준만 보여 준다.
const SORT_OPTIONS = [{ label: "대기 오래된 순", column: "waited", dir: SORT_DIR.desc }];

export function CertQueueMobileView({ queue, filter }: CertQueueMobileViewProps) {
  const query = { q: filter.query, rulebook: filter.rulebook, filter: filter.filter };
  const tabs = CERT_TABS.map((tab) =>
    tab.href === "/cert"
      ? {
          href: tab.href,
          label: (
            <HStack align="center" gap="075" render={<span />}>
              {tab.label}
              <TabCount count={queue.total} selected />
            </HStack>
          ),
        }
      : tab,
  );

  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={tabs} value="/cert" />
      {queue.total === 0 ? (
        <EmptyState image={EMPTY_IMAGE.myGames} title="심사할 신청이 없습니다" className="h-90" />
      ) : (
        <>
          <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
            <UrlSearchInput placeholder="닉네임 검색" />
            <UrlSelect
              param="rulebook"
              allLabel="룰북 전체"
              options={queue.rulebookOptions.map((rulebook) => ({
                label: rulebook,
                value: rulebook,
              }))}
            />
            <HStack gap="075" className="-mx-200 overflow-x-auto px-200">
              {FILTER_CHIPS.map(({ key, label }) => (
                <Chip
                  key={label}
                  selected={filter.filter === key}
                  render={
                    <ServerLink path={withQuery("/cert", query, { filter: key })} scroll={false} />
                  }
                >
                  {label}
                </Chip>
              ))}
            </HStack>
          </VStack>
          <ListSortBar
            total={`${queue.rows.length}건`}
            sort={{ column: "waited", dir: SORT_DIR.desc }}
            options={SORT_OPTIONS}
          />
          {queue.rows.length === 0 ? (
            <EmptyState image={EMPTY_IMAGE.search} title="조건에 맞는 신청이 없습니다" />
          ) : (
            <InfiniteList>
              {queue.rows.map((row) => (
                <CertQueueMobileRow
                  key={row.id}
                  row={row}
                  path={withQuery(`/cert/${row.id}`, query, {})}
                />
              ))}
            </InfiniteList>
          )}
        </>
      )}
    </>
  );
}
