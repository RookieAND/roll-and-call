import { Button, Chip, HStack, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import {
  CERT_MANAGE_STATUS,
  CERT_MANAGE_STATUS_LABEL,
  CERT_TABS,
  type CertManageFilter,
  type CertManageSortColumn,
  type CertManageStatus,
} from "@/entities/cert";
import type { CertManageList } from "@/entities/cert/server";
import { SORT_DIR, withQuery, type TableSort } from "@/shared/lib";
import {
  AdminHeader,
  ListSortBar,
  RouteTabs,
  ServerLink,
  TabCount,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertManageMobileRows } from "./mobile/cert-manage-mobile-rows";

const STATUS_CHIPS: { status?: CertManageStatus; label: string }[] = [
  { label: "전체" },
  ...Object.values(CERT_MANAGE_STATUS).map((status) => ({
    status,
    label: CERT_MANAGE_STATUS_LABEL[status].label,
  })),
];

const SORT_OPTIONS = [
  { label: "처리 일자 최신순", column: "changed", dir: SORT_DIR.desc },
  { label: "닉네임순", column: "user", dir: SORT_DIR.asc },
];

interface CertManageMobileViewProps {
  list: CertManageList;
  filter: CertManageFilter;
  sort: TableSort<CertManageSortColumn>;
  query: Record<string, string | undefined>;
}

// 반려로 돌리기 확인 시트는 데스크톱 화면이 주소(action=revoke)를 보고 한 번만 연다.
export function CertManageMobileView({ list, filter, sort, query }: CertManageMobileViewProps) {
  const tabs = CERT_TABS.map((tab) =>
    tab.href === "/cert"
      ? {
          href: tab.href,
          label: (
            <HStack align="center" gap="075" render={<span />}>
              {tab.label}
              <TabCount count={list.pendingCount} selected={false} />
            </HStack>
          ),
        }
      : tab,
  );
  const linkChips = [
    { param: "user", label: list.userLabel && `유저: ${list.userLabel}` },
    { param: "rulebook", label: list.rulebookLabel && `룰북: ${list.rulebookLabel}` },
  ];

  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={tabs} value="/cert/manage" />
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        <UrlSearchInput placeholder="닉네임 또는 디스코드 ID" />
        <UrlSelect
          param="edition"
          allLabel="판본 전체"
          options={list.editionOptions.map((edition) => ({ label: edition, value: edition }))}
        />
        <HStack gap="075" className="-mx-200 overflow-x-auto px-200">
          {STATUS_CHIPS.map(({ status, label }) => (
            <Chip
              key={label}
              selected={filter.status === status}
              render={
                <ServerLink
                  path={withQuery("/cert/manage", query, { status, page: undefined })}
                  scroll={false}
                />
              }
            >
              {label}
            </Chip>
          ))}
          {linkChips.map(({ param, label }) =>
            label ? (
              <Chip
                key={param}
                selected
                render={
                  <ServerLink
                    path={withQuery("/cert/manage", query, { [param]: undefined, page: undefined })}
                    scroll={false}
                    aria-label={`${label} 필터 풀기`}
                  />
                }
              >
                {label}
                <X size={12} aria-hidden />
              </Chip>
            ) : null,
          )}
        </HStack>
      </VStack>
      <ListSortBar total={`${list.rows.length}건`} sort={sort} options={SORT_OPTIONS} />
      <CertManageMobileRows list={list} query={query} />
      <VStack className="sticky bottom-0 mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]">
        <Button className="min-h-12 w-full" render={<ServerLink path="/cert/manage/grant" />}>
          인증 부여
        </Button>
      </VStack>
    </>
  );
}
