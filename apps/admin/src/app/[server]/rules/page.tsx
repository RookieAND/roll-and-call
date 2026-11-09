import type { Metadata } from "next";

import { listCertSellers, listRulebookRequests, listRulebooks } from "@/entities/rulebook/server";
import { stringParams } from "@/shared/lib";
import { requireStaff } from "@/shared/server";
import {
  RULEBOOKS_TAB,
  RulebooksMobileView,
  RulebooksView,
  type RulebooksTab,
} from "@/views/rulebooks";

export const metadata: Metadata = { title: "룰북" };

export default async function RulebooksPage({ searchParams }: PageProps<"/[server]/rules">) {
  const query = stringParams(await searchParams);
  const tab: RulebooksTab =
    Object.values(RULEBOOKS_TAB).find((candidate) => candidate === query.tab) ?? RULEBOOKS_TAB.list;
  const [rulebooks, all, requests, sellers, staff] = await Promise.all([
    listRulebooks({ query: query.q }),
    listRulebooks(),
    listRulebookRequests({ includeProcessed: true }),
    listCertSellers(),
    requireStaff(),
  ]);
  const pendingRequests = requests.filter((request) => !request.processed);
  const groupRequests = query.group
    ? requests.filter((request) => request.groupId === query.group)
    : [];
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <RulebooksView
          tab={tab}
          rulebooks={rulebooks}
          allRulebooks={all.rows}
          requests={pendingRequests}
          groupRequests={groupRequests}
          sellers={sellers}
          query={query}
          viewerId={staff.id}
        />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <RulebooksMobileView
          tab={tab}
          rulebooks={rulebooks}
          requests={pendingRequests}
          groupRequests={groupRequests}
          sellers={sellers}
          query={query}
        />
      </div>
    </>
  );
}
