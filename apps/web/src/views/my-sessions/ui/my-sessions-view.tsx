import { Container } from "@roll-and-call/ui";

import { SESSION_ROLE } from "@/entities/game";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import {
  loadMySessions,
  ONGOING_CHIP,
  SESSION_CHIP,
  SESSION_CHIPS,
  SESSION_TABS,
  SessionList,
  SessionTabs,
  sessionsHref,
} from "@/widgets/session-list";

import { SessionStatusChips } from "./session-status-chips";
import { SessionsEmpty } from "./sessions-empty";

export async function MySessionsView({ tab, status }: { tab?: string; status?: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="내 세션" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const sessions = await loadMySessions(user.id);
  const activeTab = SESSION_TABS.find((item) => item.key === tab)?.key ?? SESSION_ROLE.player;
  const chips = SESSION_CHIPS[activeTab];
  const activeChip = chips.find((chip) => chip.key === status)?.key ?? ONGOING_CHIP;
  const list = sessions[activeTab];
  const items =
    activeChip === ONGOING_CHIP
      ? list.filter((card) => card.chip !== SESSION_CHIP.ended)
      : list.filter((card) => card.chip === activeChip);
  const roleTabs = SESSION_TABS.map((item) => ({
    key: item.key,
    label: item.label,
    count: sessions[item.key].length,
    href: sessionsHref(item.key),
  }));
  const endedCount = list.filter((card) => card.chip === SESSION_CHIP.ended).length;

  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-(--rc-size-appbar) z-10 border-b border-gray-100 bg-surface">
        <SessionTabs label="역할" tabs={roleTabs} activeKey={activeTab} />
        <SessionStatusChips activeTab={activeTab} activeChip={activeChip} endedCount={endedCount} />
      </div>

      <Container size="sm">
        <div className="py-150">
          {items.length > 0 ? (
            <SessionList items={items} />
          ) : (
            <SessionsEmpty activeTab={activeTab} activeChip={activeChip} />
          )}
        </div>
      </Container>
    </>
  );
}
