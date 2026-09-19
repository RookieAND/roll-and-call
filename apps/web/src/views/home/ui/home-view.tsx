import { Container } from "@trpg/ui";

import { LoginButton } from "@/features/auth";
import { getCurrentSessionUser, getMonthSessions } from "@/shared/server";
import { AppBar, StatusNotice } from "@/shared/ui";

import { buildMonthRecord } from "../model/build-month-record";
import { groupSessionsByDay } from "../model/group-sessions-by-day";
import { resolveCalendarView } from "../model/resolve-calendar-view";
import { toCalendarSessions } from "../model/to-calendar-sessions";
import { HomeCalendarSection } from "./home-calendar-section";
import { HomeMonthRecord } from "./home-month-record";

export async function HomeView({ date, authError }: { date?: string; authError: boolean }) {
  const { monthStart, selectedKey, todayKey } = resolveCalendarView(date);
  const [user, rows] = await Promise.all([
    getCurrentSessionUser(),
    getMonthSessions(monthStart.toDate(), monthStart.add(1, "month").toDate()),
  ]);

  const sessions = toCalendarSessions(rows, user?.id ?? null);
  const sessionsByDay = groupSessionsByDay(sessions);

  return (
    <>
      <AppBar
        title="롤앤콜"
        brand
        action={!user && <LoginButton next="/" className="h-[34px] px-3 text-[13px]" />}
      />
      <Container size="sm" className="px-0">
        {authError && (
          <div className="px-4 pt-3">
            <StatusNotice tone="muted" className="text-left">
              로그인하지 못했습니다. 오른쪽 위 버튼으로 다시 시도해 주세요.
            </StatusNotice>
          </div>
        )}
        <HomeCalendarSection
          monthStart={monthStart.toDate()}
          sessionsByDay={sessionsByDay}
          initialSelectedKey={selectedKey}
          todayKey={todayKey}
        />
        <HomeMonthRecord monthStart={monthStart} record={buildMonthRecord(sessions)} />
      </Container>
    </>
  );
}
