import type { Metadata } from "next";

import { listCertSellers, listRulebookRequests, listRulebooks } from "@/shared/server";
import { RULEBOOKS_TAB, RulebooksView, type RulebooksTab } from "@/views/rulebooks";

export const metadata: Metadata = { title: "룰북" };

export default async function RulebooksPage({ searchParams }: PageProps<"/rules">) {
  const query = (await searchParams) as Record<string, string | undefined>;
  const tab: RulebooksTab =
    Object.values(RULEBOOKS_TAB).find((candidate) => candidate === query.tab) ?? RULEBOOKS_TAB.list;
  const [rulebooks, all, requests, sellers] = await Promise.all([
    listRulebooks({ query: query.q }),
    listRulebooks(),
    listRulebookRequests(),
    listCertSellers(),
  ]);
  return (
    <RulebooksView
      tab={tab}
      rulebooks={rulebooks}
      allRulebooks={all.rows}
      requests={requests}
      sellers={sellers}
      query={query}
    />
  );
}
