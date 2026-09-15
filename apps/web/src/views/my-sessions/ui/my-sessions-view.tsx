import { Container } from "@trpg/ui";

import { LoginRequired } from "@/features/auth";
import { getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import {
  loadMySessions,
  SESSION_BUCKET,
  SESSION_CHIPS,
  SESSION_TABS,
  SessionList,
  SessionTabs,
} from "@/widgets/session-list";

import { ALL_SESSION_CHIPS, sessionsHref } from "../model/sessions-href";
import { SessionStatusChips } from "./session-status-chips";
import { SessionsEmpty } from "./sessions-empty";

export async function MySessionsView({ tab, status }: { tab?: string; status?: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="내 세션" />
        <Container size="sm">
          <div className="py-6">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const sessions = await loadMySessions(user.id);
  const activeTab =
    SESSION_TABS.find((tabItem) => tabItem.key === tab)?.key ?? SESSION_BUCKET.joined;
  const chips = SESSION_CHIPS[activeTab];
  const activeChip = chips.find((chip) => chip.key === status)?.key ?? ALL_SESSION_CHIPS;
  const list = sessions[activeTab];
  const items =
    activeChip === ALL_SESSION_CHIPS ? list : list.filter((card) => card.chip === activeChip);
  const filteredChipLabel =
    activeChip === ALL_SESSION_CHIPS
      ? null
      : (chips.find((chip) => chip.key === activeChip)?.label ?? null);
  const roleTabs = SESSION_TABS.map((tabItem) => ({
    key: tabItem.key,
    label: tabItem.label,
    count: sessions[tabItem.key].length,
    href: sessionsHref(tabItem.key),
  }));

  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        <SessionTabs label="역할" tabs={roleTabs} activeKey={activeTab} />
        {chips.length > 0 && <SessionStatusChips activeTab={activeTab} activeChip={activeChip} />}
      </div>

      <Container size="sm">
        <div className="py-3">
          {items.length > 0 ? (
            <SessionList items={items} />
          ) : (
            <SessionsEmpty activeTab={activeTab} chipLabel={filteredChipLabel} />
          )}
        </div>
      </Container>
    </>
  );
}
