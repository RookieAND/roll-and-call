import type { Metadata } from "next";

import { listRulebookRequests, listRulebooks } from "@/shared/server";
import { RulebooksView } from "@/views/rulebooks";

export const metadata: Metadata = { title: "룰북" };

export default async function RulebooksPage({ searchParams }: PageProps<"/rules">) {
  const query = (await searchParams) as Record<string, string | undefined>;
  const [rulebooks, all, requests] = await Promise.all([
    listRulebooks({ query: query.q }),
    listRulebooks(),
    listRulebookRequests(),
  ]);
  const linkTargets = all.rows.filter((rulebook) => !rulebook.hidden);
  return (
    <RulebooksView
      rulebooks={rulebooks}
      linkTargets={linkTargets}
      requests={requests}
      query={query}
    />
  );
}
