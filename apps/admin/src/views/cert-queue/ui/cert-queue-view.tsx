import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { SearchX } from "lucide-react";
import Link from "next/link";

import { CERT_SEGMENTS, withQuery } from "@/shared/lib";
import type { listCertQueue } from "@/shared/server";
import {
  AdminHeader,
  EmptyState,
  Panel,
  RouteSegments,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertQueueTable } from "./cert-queue-table";

interface CertQueueViewProps {
  queue: Awaited<ReturnType<typeof listCertQueue>>;
  query: Record<string, string | undefined>;
}

export function CertQueueView({ queue, query }: CertQueueViewProps) {
  const reappliedOnly = query.reapplied === "1";
  const reappliedHref = withQuery("/cert", query, { reapplied: reappliedOnly ? undefined : "1" });

  return (
    <>
      <AdminHeader title="룰북 인증" sub={`${queue.total}건 심사 대기`} />
      <RouteSegments label="룰북 인증 화면" items={CERT_SEGMENTS} value="/cert" />
      <VStack gap="150" className="flex-1 p-200">
        {queue.total === 0 ? (
          <Panel title="심사 대기열" className="flex-1">
            <EmptyState
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
              title="심사 대기열"
              right={
                <Text typography="body4" foreground="hint">
                  오래 기다린 순
                </Text>
              }
              className="flex-1"
            >
              {queue.rows.length > 0 ? (
                <CertQueueTable rows={queue.rows} />
              ) : (
                <EmptyState icon={SearchX} title="조건에 맞는 신청이 없어요" />
              )}
            </Panel>
          </>
        )}
      </VStack>
    </>
  );
}
