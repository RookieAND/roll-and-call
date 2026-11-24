import { Container } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { notFound, redirect } from "next/navigation";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { DepartedMemberScreen } from "@/entities/profile";
import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";
import {
  countableCards,
  PROFILE_SESSION_SECTIONS,
  SessionList,
  SessionTabs,
  userSessionsHref,
} from "@/widgets/session-list";
import { loadProfile } from "@/widgets/session-list/server";

import { buildCalendarMarks } from "../model/build-calendar-marks";
import { buildUpcomingRows } from "../model/build-upcoming-rows";
import { groupUpcomingRows } from "../model/group-upcoming-rows";
import { isUpcomingCard } from "../model/is-upcoming-card";
import { kstDateKey } from "../model/kst-date-key";
import { resolveCalendarMonth } from "../model/resolve-calendar-month";
import { SCHEDULE_TAB, type ScheduleTab } from "../model/schedule-tab";
import type { DatedUpcomingRow } from "../model/upcoming-row";
import { validDateKey } from "../model/valid-date-key";
import { ScheduleCalendar } from "./schedule-calendar";
import { UpcomingList } from "./upcoming-list";
import { UserSessionsEmptyCard } from "./user-sessions-empty-card";
import { UserSessionsPanel } from "./user-sessions-panel";

const EMPTY_IMAGE = {
  [SESSION_ROLE.player]: "empty-my-games",
  [SESSION_ROLE.host]: "empty-hosted",
} as const;

interface UserSessionsViewProps {
  id: string;
  role: SessionRole;
  tab: ScheduleTab;
  date?: string;
  month?: string;
}

export async function UserSessionsView({ id, role, tab, date, month }: UserSessionsViewProps) {
  const server = await getCurrentServer();
  const viewer = await getCurrentSessionUser();
  if (viewer?.id === id) redirect(serverPath({ slug: server.slug, path: "/me/sessions" }));
  const loaded = await loadProfile({ userId: id, viewerId: viewer?.id ?? null });
  if (!loaded) notFound();

  const { profile, sessions, hosted, joined } = loaded;
  if (!isNull(profile.deletedAt)) {
    return <DepartedMemberScreen name={profile.username} avatarUrl={profile.avatarUrl} />;
  }

  const now = new Date();
  const section = PROFILE_SESSION_SECTIONS.find((candidate) => candidate.key === role)!;
  const cards = sessions[role];
  const games = role === SESSION_ROLE.host ? hosted : joined;
  const upcomingRows = buildUpcomingRows({ cards, games, now });
  const pastCards = cards.filter((card) => !isUpcomingCard({ card, now }));

  const selectedKey = validDateKey(date);
  const isSelectedDay = (value: Date | string | null) =>
    !isNull(value) && kstDateKey(value) === selectedKey;
  const shownRows = selectedKey
    ? upcomingRows.filter((row) => isSelectedDay(row.startsAt))
    : upcomingRows;
  const shownPast = selectedKey
    ? pastCards.filter((card) => isSelectedDay(card.startsAt))
    : pastCards;

  const rolePath = (past: boolean) =>
    serverPath({
      slug: server.slug,
      path: userSessionsHref({ userId: profile.id, role, past }),
    });
  const tabs = [
    {
      key: SCHEDULE_TAB.upcoming,
      label: "진행 예정",
      count: upcomingRows.length,
      href: rolePath(false),
    },
    {
      key: SCHEDULE_TAB.past,
      label: "진행·완료",
      // 탭 숫자는 숨김 카드와 취소된 구인을 뺀 수다(시안 05-5 유의 사항 2).
      count: countableCards(pastCards).filter((card) => !card.hidden).length,
      href: rolePath(true),
    },
  ];

  const calendar = (
    <ScheduleCalendar
      userId={profile.id}
      role={role}
      tab={tab}
      monthStart={resolveCalendarMonth({ date: selectedKey, month, now })}
      marks={buildCalendarMarks({ upcomingRows, pastCards })}
      todayKey={kstDateKey(now)}
      selectedKey={selectedKey}
    />
  );
  const nextRow = upcomingRows.find((row): row is DatedUpcomingRow => !isNull(row.startsAt));
  const roleLabel = section.title;

  const upcomingBody =
    shownRows.length > 0 ? (
      <UpcomingList groups={groupUpcomingRows(shownRows)} now={now} />
    ) : (
      <UserSessionsEmptyCard image="empty-schedule" title="예정된 세션이 없습니다." />
    );
  const pastBody =
    shownPast.length > 0 ? (
      <SessionList items={shownPast} />
    ) : (
      <UserSessionsEmptyCard image={EMPTY_IMAGE[role]} title={section.empty} />
    );
  const body = tab === SCHEDULE_TAB.past ? pastBody : upcomingBody;

  return (
    <PageShell
      panel={<UserSessionsPanel calendar={calendar} nextRow={nextRow} now={now} />}
      appBar={
        <AppBar
          back={`/users/${profile.id}`}
          title={`${profile.username} 님의 ${roleLabel} 세션 목록`}
        />
      }
    >
      <div className={DESKTOP_CARD_CLASS}>
        <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface desktop:static">
          <SessionTabs label="진행 상태" tabs={tabs} activeKey={tab} />
        </div>
        <Container size="sm" className="desktop:max-w-none">
          <div className="flex flex-col gap-250 py-250">
            <div className="desktop:hidden">{calendar}</div>
            {body}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
