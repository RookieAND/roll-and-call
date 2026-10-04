import { Button, Chip, HStack, VStack } from "@roll-and-call/ui";
import { Plus, X } from "lucide-react";

import {
  CERT_MANAGE_STATUS,
  CERT_MANAGE_STATUS_LABEL,
  CERT_TABS,
  paginate,
  withQuery,
  type CertManageStatus,
  type TableSort,
} from "@/shared/lib";
import type {
  CertManageFilter,
  CertManageList,
  CertManageSortColumn,
  RevokeTarget,
} from "@/shared/server";
import {
  AdminHeader,
  ListPager,
  Panel,
  RouteTabs,
  ServerLink,
  TabCount,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { CertManageTable } from "./cert-manage-table";
import { RevokeDialogSlot } from "./revoke-dialog-slot";

const STATUS_CHIPS: { status?: CertManageStatus; label: string }[] = [
  { label: "전체" },
  ...Object.values(CERT_MANAGE_STATUS).map((status) => ({
    status,
    label: CERT_MANAGE_STATUS_LABEL[status].label,
  })),
];

interface CertManageViewProps {
  list: CertManageList;
  filter: CertManageFilter;
  sort: TableSort<CertManageSortColumn>;
  query: Record<string, string | undefined>;
  serverName: string;
  revokeTarget: RevokeTarget | null;
  staffChannel: boolean;
}

export function CertManageView({
  list,
  filter,
  sort,
  query,
  serverName,
  revokeTarget,
  staffChannel,
}: CertManageViewProps) {
  const paged = paginate(list.rows, query.page);
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
      <AdminHeader title="룰북 인증" sub={serverName} />
      <RouteTabs label="룰북 인증 화면" items={tabs} value="/cert/manage" />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100" wrap>
          <UrlSearchInput placeholder="닉네임 또는 디스코드 ID" className="w-[240px]" />
          <UrlSelect
            param="edition"
            allLabel="판본 전체"
            options={list.editionOptions.map((edition) => ({ label: edition, value: edition }))}
            className="w-[180px]"
          />
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
          <Button render={<ServerLink path="/cert/manage/grant" />} className="ml-auto gap-075">
            <Plus size={16} aria-hidden />
            인증 부여
          </Button>
        </HStack>
        <Panel
          footer={
            <ListPager
              page={paged.page}
              totalPages={paged.totalPages}
              total={list.rows.length}
              unit="건"
            />
          }
          className="flex-none"
        >
          <CertManageTable
            rows={paged.rows}
            sort={sort}
            query={query}
            noRecords={list.total === 0}
          />
        </Panel>
      </VStack>
      {revokeTarget ? <RevokeDialogSlot target={revokeTarget} staffChannel={staffChannel} /> : null}
    </>
  );
}
