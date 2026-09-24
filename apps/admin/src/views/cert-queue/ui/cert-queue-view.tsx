import { Chip, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { CERT_TABS, paginate, withQuery } from "@/shared/lib";
import type { listCertQueue } from "@/shared/server";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  ListPager,
  Panel,
  RouteTabs,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertQueueTable } from "./cert-queue-table";

interface CertQueueViewProps {
  queue: Awaited<ReturnType<typeof listCertQueue>>;
  page?: string;
  query: Record<string, string | undefined>;
}

export function CertQueueView({ queue, page, query }: CertQueueViewProps) {
  const paged = paginate(queue.rows, page);
  const reappliedOnly = query.reapplied === "1";
  const reappliedHref = withQuery("/cert", query, { reapplied: reappliedOnly ? undefined : "1" });

  return (
    <>
      <AdminHeader title="룰북 인증" sub={`${queue.total}건 심사 대기`} />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert" />
      <VStack gap="150" className="flex-1 p-200">
        {queue.total === 0 ? (
          <Panel className="flex-1">
            <EmptyState
              image={EMPTY_IMAGE.myGames}
              title="심사할 신청이 없어요"
              description="새 인증 신청이 들어오면 디스코드 #운영 채널로 알림이 갑니다."
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
              <Chip selected={reappliedOnly} render={<Link href={reappliedHref} scroll={false} />}>
                재신청만
              </Chip>
            </HStack>
            <Panel
              className="flex-1"
              footer={
                <ListPager
                  page={paged.page}
                  totalPages={paged.totalPages}
                  total={queue.rows.length}
                  unit="건"
                />
              }
            >
              <CertQueueTable rows={paged.rows} />
            </Panel>
          </>
        )}
      </VStack>
    </>
  );
}
