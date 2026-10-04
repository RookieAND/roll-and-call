import { Chip, HStack, VStack } from "@roll-and-call/ui";

import { CERT_TABS, paginate, withQuery } from "@/shared/lib";
import {
  CERT_QUEUE_FILTERS,
  type CertQueueFilter,
  type CertQueueFilterKey,
  type listCertQueue,
} from "@/shared/server";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  ListPager,
  Panel,
  RouteTabs,
  ServerLink,
  SortFixedNote,
  TabCount,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertQueueTable } from "./cert-queue-table";

interface CertQueueViewProps {
  queue: Awaited<ReturnType<typeof listCertQueue>>;
  serverName: string;
  page?: string;
  filter: CertQueueFilter;
}

const FILTER_CHIPS = [
  { key: undefined, label: "전체" },
  ...(Object.entries(CERT_QUEUE_FILTERS) as [CertQueueFilterKey, string][]).map(([key, label]) => ({
    key,
    label,
  })),
];

export function CertQueueView({ queue, serverName, page, filter }: CertQueueViewProps) {
  const paged = paginate(queue.rows, page);
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
      <AdminHeader title="룰북 인증" sub={serverName} />
      <RouteTabs label="룰북 인증 화면" items={tabs} value="/cert" />
      <VStack gap="150" className="flex-1 p-200">
        {queue.total === 0 ? (
          <Panel>
            <EmptyState
              image={EMPTY_IMAGE.myGames}
              title="심사할 신청이 없습니다"
              description="새 인증 신청이 들어오면 여기에 표시됩니다."
            />
          </Panel>
        ) : (
          <>
            <HStack align="center" gap="100">
              <UrlSearchInput placeholder="닉네임 검색" className="w-[220px]" />
              <UrlSelect
                param="rulebook"
                allLabel="룰북 전체"
                options={queue.rulebookOptions.map((rulebook) => ({
                  label: rulebook,
                  value: rulebook,
                }))}
                className="w-[150px]"
              />
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
              <SortFixedNote />
            </HStack>
            <Panel
              footer={
                <ListPager
                  page={paged.page}
                  totalPages={paged.totalPages}
                  total={queue.rows.length}
                  unit="건"
                />
              }
            >
              <CertQueueTable rows={paged.rows} query={query} />
            </Panel>
          </>
        )}
      </VStack>
    </>
  );
}
