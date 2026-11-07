import { Chip, HStack, VStack } from "@roll-and-call/ui";

import { CERT_QUEUE_FILTERS, type CertQueueFilter, type CertQueueFilterKey } from "@/entities/cert";
import { CertTabs, type listCertQueue } from "@/entities/cert/server";
import { paginate, parsePageSize, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  ListPager,
  Panel,
  ServerLink,
  SortFixedNote,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertQueueTable } from "./cert-queue-table";

interface CertQueueViewProps {
  queue: Awaited<ReturnType<typeof listCertQueue>>;
  page?: string;
  pageSizeParam?: string;
  filter: CertQueueFilter;
}

const FILTER_CHIPS = [
  { key: undefined, label: "전체" },
  ...(Object.entries(CERT_QUEUE_FILTERS) as [CertQueueFilterKey, string][]).map(([key, label]) => ({
    key,
    label,
  })),
];

export function CertQueueView({ queue, page, pageSizeParam, filter }: CertQueueViewProps) {
  const pageSize = parsePageSize(pageSizeParam);
  const paged = paginate(queue.rows, page, pageSize);
  const query = {
    q: filter.query,
    rulebook: filter.rulebook,
    filter: filter.filter,
    pageSize: pageSizeParam,
  };

  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertTabs value="/cert" />
      <VStack gap="150" className="flex-1 p-200">
        {queue.total === 0 ? (
          <Panel>
            <EmptyState image={EMPTY_IMAGE.myGames} title="심사할 신청이 없습니다" />
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
                  pageSize={pageSize}
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
