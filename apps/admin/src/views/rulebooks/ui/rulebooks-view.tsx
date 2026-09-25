import { Button, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import {
  REQUEST_ACTION,
  RequestDialog,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { CATEGORY_PAGE_SIZE, paginate, withQuery } from "@/shared/lib";
import type { RulebookCategory, RulebookRequestRow, RulebookRow } from "@/shared/server";
import { AdminHeader, ListPager, Panel, UrlSearchInput } from "@/shared/ui";

import { AddRulebookRoute } from "./add-rulebook-route";
import { ApproveRequestRoute } from "./approve-request-route";
import { RequestPanel } from "./request-panel";
import { RulebookTable } from "./rulebook-table";

interface RulebooksViewProps {
  rulebooks: { total: number; rows: RulebookRow[]; categories: RulebookCategory[] };
  allRulebooks: RulebookRow[];
  requests: RulebookRequestRow[];
  query: Record<string, string | undefined>;
}

// 표는 카테고리 단위로 쪽을 나눈다. 검색·숨김 필터에 걸린 책이 없는 카테고리는 빠진다.
export function RulebooksView({ rulebooks, allRulebooks, requests, query }: RulebooksViewProps) {
  const hiddenOnly = query.hidden === "1";
  const linkTargets = allRulebooks.filter((rulebook) => !rulebook.hidden);
  const hasHidden = linkTargets.length < rulebooks.total;
  const listQuery = { q: query.q, hidden: query.hidden };
  const rows = hiddenOnly ? rulebooks.rows.filter((row) => row.hidden) : rulebooks.rows;
  const groups = rulebooks.categories
    .map((category) => ({ category, rows: rows.filter((row) => row.category === category.name) }))
    .filter((group) => group.rows.length > 0);
  const paged = paginate(groups, query.page, CATEGORY_PAGE_SIZE);
  const pageQuery = { ...listQuery, page: query.page };
  const closeHref = withQuery("/rules", pageQuery, {});
  const openedRequest = requests.find((request) => request.id === query.request) ?? null;
  const openedAction =
    query.action === REQUEST_ACTION.link || query.action === REQUEST_ACTION.reject
      ? query.action
      : null;
  const opened =
    openedAction && openedRequest ? { action: openedAction, request: openedRequest } : null;
  const approving = query.action === REQUEST_ACTION.add ? openedRequest : null;
  const actionHref = (action: RequestAction, requestId: string) =>
    withQuery("/rules", pageQuery, { action, request: requestId });

  return (
    <>
      <AdminHeader
        title="룰북"
        sub={`카테고리 ${rulebooks.categories.length}개 · 책 ${rulebooks.total}권`}
      />
      <VStack gap="150" className="flex-1 p-200">
        <RequestPanel requests={requests} actionHref={actionHref} />
        <Panel
          right={
            <>
              <UrlSearchInput
                placeholder="이름, 판본, 카테고리, 다른 이름"
                size="sm"
                className="w-[260px]"
              />
              {hasHidden || hiddenOnly ? (
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  render={
                    <Link
                      href={withQuery("/rules", listQuery, {
                        hidden: hiddenOnly ? undefined : "1",
                      })}
                      scroll={false}
                    />
                  }
                >
                  {hiddenOnly ? "전체 룰북 보기" : "숨긴 룰북 보기"}
                </Button>
              ) : null}
              <Button
                size="sm"
                render={<Link href={withQuery("/rules", pageQuery, { add: "1" })} scroll={false} />}
                className="gap-050"
              >
                <Plus size={14} aria-hidden />
                룰북 추가
              </Button>
            </>
          }
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
      </VStack>
      <RequestDialog opened={opened} rulebooks={linkTargets} closeHref={closeHref} />
      <ApproveRequestRoute request={approving} rulebooks={allRulebooks} closeHref={closeHref} />
      <AddRulebookRoute
        open={query.add === "1"}
        rulebooks={allRulebooks}
        initialCategory={query.category}
        closeHref={closeHref}
      />
    </>
  );
}
