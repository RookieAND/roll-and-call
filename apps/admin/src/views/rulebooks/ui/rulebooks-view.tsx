import { Button, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import {
  REQUEST_ACTION,
  RequestDialog,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { paginate, withQuery } from "@/shared/lib";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import { AdminHeader, ListPager, Panel, UrlSearchInput } from "@/shared/ui";

import { AddRulebookRoute } from "./add-rulebook-route";
import { RequestPanel } from "./request-panel";
import { RulebookTable } from "./rulebook-table";

interface RulebooksViewProps {
  rulebooks: { total: number; rows: RulebookRow[] };
  linkTargets: RulebookRow[];
  requests: RulebookRequestRow[];
  query: Record<string, string | undefined>;
}

export function RulebooksView({ rulebooks, linkTargets, requests, query }: RulebooksViewProps) {
  const hiddenOnly = query.hidden === "1";
  const hasHidden = linkTargets.length < rulebooks.total;
  const listQuery = { q: query.q, hidden: query.hidden };
  const rows = hiddenOnly ? rulebooks.rows.filter((row) => row.hidden) : rulebooks.rows;
  const paged = paginate(rows, query.page);
  const pager = (
    <ListPager page={paged.page} totalPages={paged.totalPages} total={rows.length} unit="개" />
  );
  const pageQuery = { ...listQuery, page: query.page };
  const closeHref = withQuery("/rules", pageQuery, {});
  const openedAction = Object.values(REQUEST_ACTION).find((action) => action === query.action);
  const openedRequest = requests.find((request) => request.id === query.request);
  const opened =
    openedAction && openedRequest ? { action: openedAction, request: openedRequest } : null;
  const actionHref = (action: RequestAction, requestId: string) =>
    withQuery("/rules", pageQuery, { action, request: requestId });

  return (
    <>
      <AdminHeader title="룰북" sub={`등록된 룰북 ${rulebooks.total}개`} />
      <VStack gap="150" className="flex-1 p-200">
        <RequestPanel requests={requests} actionHref={actionHref} />
        <Panel
          title="룰북"
          right={
            <>
              <UrlSearchInput placeholder="룰북 검색" size="sm" className="w-[180px]" />
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
              >
                룰북 추가
              </Button>
            </>
          }
          className="flex-1"
          footer={pager}
        >
          <RulebookTable rows={paged.rows} />
        </Panel>
      </VStack>
      <RequestDialog opened={opened} rulebooks={linkTargets} closeHref={closeHref} />
      <AddRulebookRoute open={query.add === "1"} closeHref={closeHref} />
    </>
  );
}
