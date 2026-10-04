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

export async function HomeView({ date }: { date?: string }) {
  const { monthStart, selectedKey, todayKey } = resolveCalendarView(date);
  const now = new Date();
  const server = await getCurrentServer();
  const [user, rows] = await Promise.all([
    getCurrentSessionUser(),
    getMonthSessions({
      serverId: server.id,
      from: monthStart.toDate(),
      to: monthStart.add(1, "month").toDate(),
    }),
  ]);

  const profile = user ? await getProfile(server.id, user.id) : undefined;
  const sessions = toCalendarSessions({ rows, viewerId: user?.id ?? null, now });
  const sessionsByDay = groupSessionsByDay(sessions);

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
      <Container size="sm" className="px-0">
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
          sessionsByDay={sessionsByDay}
          initialSelectedKey={selectedKey}
          todayKey={todayKey}
        />
        <HomeMonthRecord monthStart={monthStart} record={buildMonthRecord({ rows, now })} />
      </Container>
      {user && (
        <Suspense fallback={null}>
          <BadgeAwardGate userId={user.id} />
        </Suspense>
      )}
    </>
  );
}
