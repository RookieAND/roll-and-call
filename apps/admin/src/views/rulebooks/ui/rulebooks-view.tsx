import { Button, VStack } from "@roll-and-call/ui";
import { SearchX } from "lucide-react";
import Link from "next/link";

import {
  REQUEST_ACTION,
  RequestDialog,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { withQuery } from "@/shared/lib";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import { AdminHeader, EmptyState, Panel, UrlSearchInput } from "@/shared/ui";

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
  const listQuery = { q: query.q };
  const closeHref = withQuery("/rules", listQuery, {});
  const openedAction = Object.values(REQUEST_ACTION).find((action) => action === query.action);
  const openedRequest = requests.find((request) => request.id === query.request);
  const opened =
    openedAction && openedRequest ? { action: openedAction, request: openedRequest } : null;
  const actionHref = (action: RequestAction, requestId: string) =>
    withQuery("/rules", listQuery, { action, request: requestId });

  return (
    <>
      <AdminHeader title="룰북" sub={`등록된 룰북 ${rulebooks.total}개`} />
      <VStack gap="150" className="flex-1 p-200">
        <RequestPanel requests={requests} actionHref={actionHref} />
        <Panel
          title="룰북"
          right={
            <>
              <UrlSearchInput placeholder="룰북 검색" className="w-[180px]" />
              <Button
                size="sm"
                render={<Link href={withQuery("/rules", listQuery, { add: "1" })} scroll={false} />}
              >
                룰북 추가
              </Button>
            </>
          }
          className="flex-1"
        >
          {rulebooks.rows.length > 0 ? (
            <RulebookTable rows={rulebooks.rows} />
          ) : (
            <EmptyState icon={SearchX} title="조건에 맞는 룰북이 없어요" />
          )}
        </Panel>
      </VStack>
      <RequestDialog opened={opened} rulebooks={linkTargets} closeHref={closeHref} />
      <AddRulebookRoute open={query.add === "1"} closeHref={closeHref} />
    </>
  );
}
