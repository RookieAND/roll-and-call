import type { RankingMode } from "@roll-and-call/database/servers/model";
import type { Metadata } from "next";

import { getCurrentServer } from "@/shared/server";
import { ServerOptionsForm, ServerOptionsMobileForm } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 서버 설정" };

export default async function SettingsOptionsPage() {
  const server = await getCurrentServer();
  const props = {
    savedRankingMode: server.rankingMode as RankingMode,
    savedAdultOnlyEnabled: server.adultOnlyEnabled,
  };
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <ServerOptionsForm {...props} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <ServerOptionsMobileForm {...props} />
      </div>
    </>
  );
}
