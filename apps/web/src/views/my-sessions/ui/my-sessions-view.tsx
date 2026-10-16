import { Container } from "@roll-and-call/ui";

import { SESSION_ROLE } from "@/entities/game";
import { LoginRequired } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import {
  countableCards,
  isOngoingCard,
  ONGOING_CHIP,
  SESSION_CHIPS,
  SESSION_TABS,
  SessionList,
  SessionTabs,
  sessionsHref,
} from "@/widgets/session-list";
import { loadMySessions } from "@/widgets/session-list/server";

import { SessionStatusChips } from "./session-status-chips";
import { SessionsEmpty } from "./sessions-empty";

interface MySessionsViewProps {
  tab?: string;
  status?: string;
}

export async function MySessionsView({ tab, status }: MySessionsViewProps) {
  const server = await getCurrentServer();
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <PageShell appBar={<AppBar back="/me" title="내 세션" />}>
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm" className="desktop:max-w-none">
            <div className="py-300">
              <LoginRequired />
            </div>
          </Container>
        </div>
      </PageShell>
    );
  }

  const sessions = await loadMySessions({ serverId: server.id, userId: user.id });
  const activeTab = SESSION_TABS.find((item) => item.key === tab)?.key ?? SESSION_ROLE.player;
  const chips = SESSION_CHIPS[activeTab];
  const activeChip = chips.find((chip) => chip.key === status)?.key ?? ONGOING_CHIP;
  const list = sessions[activeTab];
  const inChip = (chip: string) => (card: (typeof list)[number]) =>
    chip === ONGOING_CHIP ? isOngoingCard(card) : card.chip === chip;
  const items = list.filter(inChip(activeChip));
  const roleTabs = SESSION_TABS.map((item) => ({
    key: item.key,
    label: item.label,
    count: countableCards(sessions[item.key]).length,
    href: serverPath({ slug: server.slug, path: sessionsHref({ role: item.key }) }),
  }));
  const chipCounts = Object.fromEntries(
    chips.map((chip) => [chip.key, countableCards(list).filter(inChip(chip.key)).length]),
  );

  return (
    <PageShell appBar={<AppBar back="/me" title="내 세션" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) border-b border-gray-200 bg-surface pb-150 desktop:static">
          <SessionTabs label="역할" tabs={roleTabs} activeKey={activeTab} />
          <SessionStatusChips activeTab={activeTab} activeChip={activeChip} counts={chipCounts} />
        </div>

        <Container size="sm" className="desktop:max-w-none">
          <div className="py-150 desktop:py-200">
            {items.length > 0 ? (
              <SessionList items={items} />
            ) : (
              <SessionsEmpty activeTab={activeTab} activeChip={activeChip} />
            )}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
