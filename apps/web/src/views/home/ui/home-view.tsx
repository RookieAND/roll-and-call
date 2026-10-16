import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
import { HStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { BadgeAwardGate } from "@/features/acknowledge-badges";
import { LoginButton } from "@/features/auth";
import { MemberTitleSheetsProvider } from "@/features/view-badge";
import { loadMemberTitleSheets } from "@/features/view-badge/server";
import { serverPath } from "@/shared/lib";
import {
  getCurrentServer,
  getCurrentSessionUser,
  getMonthSessions,
  getProfile,
  getReviewAppearances,
  hasSessionsBetween,
  listRankingHiddenUserIds,
} from "@/shared/server";
import {
  AppBar,
  DESKTOP_CARD_CLASS,
  HelpButton,
  ServerSwitcher,
  ThemeToggleButton,
} from "@/shared/ui";

import { buildMonthRecord } from "../model/build-month-record";
import { groupSessionsByDay } from "../model/group-sessions-by-day";
import { recordPeopleIds } from "../model/record-people-ids";
import { resolveCalendarView } from "../model/resolve-calendar-view";
import { toCalendarSessions } from "../model/to-calendar-sessions";
import { HomeCalendarSection } from "./home-calendar-section";
import { HomeDayPanel } from "./home-day-panel";
import { HomeLayout } from "./home-layout";
import { HomeMonthRecord } from "./home-month-record";
import { HomeNicknameNotice } from "./home-nickname-notice";
import { HomeServerSwitch } from "./home-server-switch";
import { HomeTodoBanner } from "./home-todo-banner";

interface HomeViewProps {
  date?: string;
}

export async function HomeView({ date }: HomeViewProps) {
  const { monthStart, selectedKey, todayKey } = resolveCalendarView(date);
  const now = new Date();
  const server = await getCurrentServer();
  const nextMonthStart = monthStart.add(1, "month");
  const mode = server.rankingMode as RankingMode;
  const [user, rows, hasNextMonthSessions, reviews, hiddenUserIds] = await Promise.all([
    getCurrentSessionUser(),
    getMonthSessions({
      serverId: server.id,
      from: monthStart.toDate(),
      to: nextMonthStart.toDate(),
    }),
    hasSessionsBetween({
      serverId: server.id,
      from: nextMonthStart.toDate(),
      to: nextMonthStart.add(1, "month").toDate(),
    }),
    mode === RANKING_MODE.points
      ? getReviewAppearances({
          serverId: server.id,
          from: monthStart.toDate(),
          to: nextMonthStart.toDate(),
        })
      : [],
    listRankingHiddenUserIds({ serverId: server.id }),
  ]);

  const profile = user ? await getProfile(server.id, user.id) : undefined;
  const sessions = toCalendarSessions({ rows, viewerId: user?.id ?? null, now });
  const record = buildMonthRecord({ rows, now, mode, reviews, hiddenUserIds });
  const titleSheets = await loadMemberTitleSheets({
    serverId: server.id,
    userIds: recordPeopleIds(record),
    now,
  });

  const sessionsByDay = groupSessionsByDay(sessions);
  const appBar = (
    <>
      <AppBar
        title="롤앤콜"
        desktopTitle="홈"
        brand
        serverSwitch={
          user && (
            <Suspense fallback={<ServerSwitcher />}>
              <HomeServerSwitch userId={user.id} />
            </Suspense>
          )
        }
        action={
          user ? (
            <HelpButton />
          ) : (
            <HStack align="center" gap="050">
              <ThemeToggleButton />
              <LoginButton
                next={serverPath({ slug: server.slug, path: "/" })}
                className="h-[34px] px-150 text-body3"
              />
            </HStack>
          )
        }
      />
      {user && (
        <Suspense fallback={null}>
          <HomeTodoBanner serverId={server.id} userId={user.id} />
        </Suspense>
      )}
    </>
  );

  return (
    <HomeLayout
      appBar={appBar}
      panel={<HomeDayPanel sessionsByDay={sessionsByDay} initialSelectedKey={selectedKey} />}
    >
      {profile?.nicknameSuffixBase && (
        <div className="px-200 pt-150 desktop:px-0 desktop:pt-0 desktop:pb-150">
          <HomeNicknameNotice nickname={profile.username} />
        </div>
      )}
      <HomeCalendarSection
        monthStart={monthStart.toDate()}
        sessionsByDay={sessionsByDay}
        hasNextMonthSessions={hasNextMonthSessions}
        initialSelectedKey={selectedKey}
        todayKey={todayKey}
      />
      <MemberTitleSheetsProvider sheets={titleSheets}>
        <div className={`${DESKTOP_CARD_CLASS} desktop:mt-300`}>
          <HomeMonthRecord monthStart={monthStart} record={record} />
        </div>
      </MemberTitleSheetsProvider>
      {user && (
        <Suspense fallback={null}>
          <BadgeAwardGate userId={user.id} />
        </Suspense>
      )}
    </HomeLayout>
  );
}
