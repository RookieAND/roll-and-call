import { Button, Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import type {
  CertSellerRow,
  RulebookCategory,
  RulebookRequestRow,
  RulebookRow,
} from "@/entities/rulebook/server";
import { MobileAddSellerButton, MobileSellerRow } from "@/features/manage-cert-sellers";
import { REQUEST_ACTION, type RequestAction } from "@/features/process-rulebook-request";
import { quoteWithParticle, withAndParticle, withQuery } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  InfiniteRows,
  MobileActionBar,
  RouteTabs,
  ServerLink,
  TabCount,
  UrlSearchInput,
} from "@/shared/ui";

import { RULEBOOKS_TAB, type RulebooksTab } from "../model/rulebooks-tab";
import { BookRow } from "./mobile/book-row";
import { CategoryHead } from "./mobile/category-head";
import { RequestDetail } from "./mobile/request-detail";
import { RequestList } from "./mobile/request-list";

interface RulebooksMobileViewProps {
  tab: RulebooksTab;
  rulebooks: {
    total: number;
    rows: RulebookRow[];
    categories: RulebookCategory[];
    editionsWithoutCore: string[];
  };
  requests: RulebookRequestRow[];
  sellers: CertSellerRow[];
  query: Record<string, string | undefined>;
}

// 요청 처리 확인창은 데스크톱 View의 RequestDialog가 주소(action·request)를 보고 띄운다(모바일에선 시트).
export function RulebooksMobileView({
  tab,
  rulebooks,
  requests,
  sellers,
  query,
}: RulebooksMobileViewProps) {
  const pageQuery = { tab: tab === RULEBOOKS_TAB.list ? undefined : tab, q: query.q };
  const actionHref = (action: RequestAction, requestId: string) =>
    action === REQUEST_ACTION.add
      ? withQuery("/rules/new", {}, { request: requestId })
      : withQuery("/rules", pageQuery, { action, request: requestId });
  const openedRequest =
    tab === RULEBOOKS_TAB.requests
      ? (requests.find((request) => request.id === query.request) ?? null)
      : null;
  if (openedRequest) return <RequestDetail request={openedRequest} actionHref={actionHref} />;

  const groups = rulebooks.categories
    .map((category) => ({
      category,
      rows: rulebooks.rows.filter((row) => row.category === category.name),
    }))
    .filter((group) => group.rows.length > 0);
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
      <AdminHeader title="룰북 카탈로그" />
      <RouteTabs label="룰북 화면" items={tabs} value={tabHref} />
      {tab === RULEBOOKS_TAB.list ? (
        <>
          <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
            {!query.q && rulebooks.editionsWithoutCore.length > 0 ? (
              <Callout.Root colorPalette="warning">
                <Callout.Icon />
                <Callout.Description>
                  {rulebooks.editionsWithoutCore.join(", ")} 판본은 구인 룰로 고를 수 없습니다. 기본
                  룰북을 추가해 주세요.
                </Callout.Description>
              </Callout.Root>
            ) : null}
            <UrlSearchInput placeholder="이름, 판본, 카테고리, 다른 이름" className="w-full" />
          </VStack>
          {groups.length === 0 ? (
            <EmptyState
              image={EMPTY_IMAGE.search}
              title={
                query.q
                  ? `${quoteWithParticle(query.q, withAndParticle)} 일치하는 룰북이 없습니다`
                  : "조건에 맞는 룰북이 없습니다"
              }
              description="이름, 판본, 카테고리, 다른 이름에서 찾았습니다. 추가 요청 탭에 같은 이름이 있는지 확인하거나 룰북을 새로 추가해 주세요."
            />
          ) : (
            <InfiniteRows
              unit="개 카테고리"
              rows={groups.map(({ category, rows }) => (
                <section key={category.name} aria-label={category.name}>
                  <CategoryHead category={category} />
                  {rows.map((row) => (
                    <BookRow key={row.id} row={row} />
                  ))}
                </section>
              ))}
            />
          )}
          <MobileActionBar elevated={false}>
            <Button size="lg" render={<ServerLink path="/rules/new" />}>
              룰북 추가
            </Button>
          </MobileActionBar>
        </>
      ) : null}
      {tab === RULEBOOKS_TAB.requests ? <RequestList requests={requests} /> : null}
      {tab === RULEBOOKS_TAB.sellers ? (
        <>
          <VStack>
            {sellers.map((seller) => (
              <MobileSellerRow
                key={seller.id}
                id={seller.id}
                name={seller.name}
                certifiedCount={seller.certifiedCount}
              />
            ))}
          </VStack>
          <Text typography="body4" foreground="hint" render={<p />} className="px-200 py-150">
            목록에 없는 판매처는 신청자가 「기타」를 고른 뒤 직접 입력합니다.
          </Text>
          <MobileActionBar elevated={false}>
            <MobileAddSellerButton />
          </MobileActionBar>
        </>
      ) : null}
    </>
  );
}
