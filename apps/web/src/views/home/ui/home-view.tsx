import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
import { Container, HStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { BadgeAwardGate } from "@/features/acknowledge-badges";
import { LoginButton } from "@/features/auth";
import { serverPath } from "@/shared/lib";
import {
  getCurrentServer,
  getCurrentSessionUser,
  getMonthSessions,
  getProfile,
  getReviewAppearances,
  hasSessionsBetween,
} from "@/shared/server";
import { AppBar, HelpButton, ServerSwitcher, ThemeToggleButton } from "@/shared/ui";

import { buildMonthRecord } from "../model/build-month-record";
import { groupSessionsByDay } from "../model/group-sessions-by-day";
import { resolveCalendarView } from "../model/resolve-calendar-view";
import { toCalendarSessions } from "../model/to-calendar-sessions";
import { HomeCalendarSection } from "./home-calendar-section";
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
  const [user, rows, hasNextMonthSessions, reviews] = await Promise.all([
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
  ]);

  const profile = user ? await getProfile(server.id, user.id) : undefined;
  const sessions = toCalendarSessions({ rows, viewerId: user?.id ?? null, now });

  return (
    <>
      <AppBar
        title="롤앤콜"
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
      <Container size="sm" className="max-w-3xl px-0">
        {profile?.nicknameSuffixBase && (
          <div className="px-200 pt-150">
            <HomeNicknameNotice nickname={profile.username} />
          </div>
        )}
        {user && (
          <Suspense fallback={null}>
            <HomeTodoBanner serverId={server.id} userId={user.id} />
          </Suspense>
        )}
        <HomeCalendarSection
          monthStart={monthStart.toDate()}
          sessionsByDay={groupSessionsByDay(sessions)}
          hasNextMonthSessions={hasNextMonthSessions}
          initialSelectedKey={selectedKey}
          todayKey={todayKey}
        />
        <HomeMonthRecord
          monthStart={monthStart}
          record={buildMonthRecord({ rows, now, mode, reviews })}
        />
      </Container>
      {user && (
        <Suspense fallback={null}>
          <BadgeAwardGate userId={user.id} />
        </Suspense>
      )}
    </>
  );
}
