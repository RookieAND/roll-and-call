import { Button, Callout, HStack, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import {
  REQUEST_ACTION,
  RequestDialog,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { CATEGORY_PAGE_SIZE, paginate, withQuery } from "@/shared/lib";
import type {
  CertSellerRow,
  RulebookCategory,
  RulebookRequestRow,
  RulebookRow,
} from "@/shared/server";
import {
  AdminHeader,
  ListPager,
  Panel,
  RouteTabs,
  TabCount,
  UrlSearchInput,
  ServerLink,
} from "@/shared/ui";

import { RULEBOOKS_TAB, type RulebooksTab } from "../model/rulebooks-tab";
import { RequestPanel } from "./request-panel";
import { RulebookTable } from "./rulebook-table";
import { SellersPanel } from "./sellers-panel";

interface RulebooksViewProps {
  tab: RulebooksTab;
  rulebooks: {
    total: number;
    rows: RulebookRow[];
    categories: RulebookCategory[];
    editionsWithoutCore: string[];
  };
  allRulebooks: RulebookRow[];
  requests: RulebookRequestRow[];
  sellers: CertSellerRow[];
  query: Record<string, string | undefined>;
  viewerId: string;
}

export function RulebooksView({
  tab,
  rulebooks,
  allRulebooks,
  requests,
  sellers,
  query,
  viewerId,
}: RulebooksViewProps) {
  const linkTargets = allRulebooks.filter((rulebook) => !rulebook.hidden);
  const groups = rulebooks.categories
    .map((category) => ({
      category,
      rows: rulebooks.rows.filter((row) => row.category === category.name),
    }))
    .filter((group) => group.rows.length > 0);
  const paged = paginate(groups, query.page, CATEGORY_PAGE_SIZE);
  const pageQuery = {
    tab: tab === RULEBOOKS_TAB.list ? undefined : tab,
    q: query.q,
    page: query.page,
  };
  const closeHref = withQuery("/rules", pageQuery, {});
  const openedRequest = requests.find((request) => request.id === query.request) ?? null;
  const openedAction =
    query.action === REQUEST_ACTION.link || query.action === REQUEST_ACTION.reject
      ? query.action
      : null;
  const opened =
    openedAction && openedRequest ? { action: openedAction, request: openedRequest } : null;
  const actionHref = (action: RequestAction, requestId: string) =>
    action === REQUEST_ACTION.add
      ? withQuery("/rules/new", {}, { request: requestId })
      : withQuery("/rules", pageQuery, { action, request: requestId });
  const tabs = [
    { label: "룰북 목록", href: "/rules" },
    {
      label: (
        <HStack align="center" gap="075" render={<span />}>
          추가 요청
          <TabCount count={requests.length} selected={tab === RULEBOOKS_TAB.requests} />
        </HStack>
      ),
      href: `/rules?tab=${RULEBOOKS_TAB.requests}`,
    },
    { label: "전자책 판매처", href: `/rules?tab=${RULEBOOKS_TAB.sellers}` },
  ];
  const tabHref = tab === RULEBOOKS_TAB.list ? "/rules" : `/rules?tab=${tab}`;

  return (
    <>
      <AdminHeader
        title="룰북 카탈로그"
        trail={[{ href: "/rules", label: "룰북" }]}
        sub={`카테고리 ${rulebooks.categories.length}개 · 책 ${rulebooks.total}권`}
      />
      <RouteTabs label="룰북 화면" items={tabs} value={tabHref} />
      <VStack gap="150" className="flex-1 p-200">
        {tab === RULEBOOKS_TAB.requests ? (
          <RequestPanel requests={requests} actionHref={actionHref} />
        ) : null}
        {tab === RULEBOOKS_TAB.sellers ? <SellersPanel sellers={sellers} /> : null}
        {tab === RULEBOOKS_TAB.list ? (
          <>
            {!query.q && rulebooks.editionsWithoutCore.length > 0 ? (
              <Callout.Root colorPalette="warning">
                <Callout.Icon />
                <Callout.Description>
                  {rulebooks.editionsWithoutCore.join(", ")} 판본은 구인 룰로 고를 수 없습니다.
                  <br />
                  기본 룰북을 추가해 주세요.
                </Callout.Description>
              </Callout.Root>
            ) : null}
            <HStack align="center" gap="100">
              <UrlSearchInput placeholder="이름, 판본, 카테고리, 다른 이름" className="w-[300px]" />
              <Button render={<ServerLink path="/rules/new" />} className="ml-auto gap-050">
                <Plus size={16} aria-hidden />
                룰북 추가
              </Button>
            </HStack>
            <Panel
              footer={
                <ListPager
                  page={paged.page}
                  totalPages={paged.totalPages}
                  total={groups.length}
                  unit="개 카테고리"
                  pageSize={CATEGORY_PAGE_SIZE}
                />
              }
            >
              <RulebookTable groups={paged.rows} query={query.q} />
            </Panel>
          </>
        ) : null}
      </VStack>
      <RequestDialog
        opened={opened}
        rulebooks={linkTargets}
        closeHref={closeHref}
        viewerId={viewerId}
      />
    </>
  );
}
