import type { Dayjs } from "dayjs";
import { ImageResponse } from "next/og";

import type { buildMonthCells, groupSessionsByDay } from "@/views/home";
import { MAX_CALENDAR_LINES } from "@/views/home";

import { loadPretendard } from "./load-pretendard";

const WIDTH = 1000;
const HEADER_HEIGHT = 84;
const WEEKDAY_HEIGHT = 40;
const CELL_HEIGHT = 136;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const COLOR = {
  surface: "#ffffff", // tokens-check-ignore: satori는 CSS 변수를 못 읽어 styles.css 라이트 값을 옮겼다
  head: "#f0f0f4", // tokens-check-ignore
  canvas: "#f5f5f8", // tokens-check-ignore
  line: "#dcdce4", // tokens-check-ignore
  ink: "#1a1a20", // tokens-check-ignore
  muted: "#5f5f6b", // tokens-check-ignore
  hint: "#70707a", // tokens-check-ignore
  primary: "#4f46e5", // tokens-check-ignore
  sunday: "#b03a62", // tokens-check-ignore
  saturday: "#2c6ba0", // tokens-check-ignore
} as const;

function dayColor({ weekday, holiday }: { weekday: number; holiday: boolean }) {
  if (holiday || weekday === 0) return COLOR.sunday;
  return weekday === 6 ? COLOR.saturday : COLOR.muted;
}

function dayNumberColor({
  today,
  inMonth,
  weekday,
  holiday,
}: {
  today: boolean;
  inMonth: boolean;
  weekday: number;
  holiday: boolean;
}) {
  if (today) return "#ffffff"; // tokens-check-ignore
  return inMonth ? dayColor({ weekday, holiday }) : COLOR.hint;
}

// 홈 달력의 데스크톱 모양을 satori가 읽는 flex 마크업으로 다시 그린다.
export async function renderCalendarImage({
  monthStart,
  cells,
  sessionsByDay,
  holidays,
  todayKey,
}: {
  monthStart: Dayjs;
  cells: ReturnType<typeof buildMonthCells>;
  sessionsByDay: ReturnType<typeof groupSessionsByDay>;
  holidays: Readonly<Record<string, readonly string[]>>;
  todayKey: string;
}) {
  const weeks = Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
  const height = HEADER_HEIGHT + WEEKDAY_HEIGHT + weeks.length * CELL_HEIGHT + 24;

  const image = new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: WIDTH,
        height,
        padding: "0 24px 24px",
        background: COLOR.surface,
        fontFamily: "Pretendard",
        color: COLOR.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: HEADER_HEIGHT,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        {monthStart.format("YYYY년 M월")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${COLOR.line}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: WEEKDAY_HEIGHT, background: COLOR.head }}>
          {WEEKDAYS.map((weekday, index) => (
            <div
              key={weekday}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                paddingLeft: 12,
                fontSize: 16,
                fontWeight: 700,
                color: dayColor({ weekday: index, holiday: false }),
              }}
            >
              {weekday}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]?.key} style={{ display: "flex", height: CELL_HEIGHT }}>
            {week.map((cell) => {
              const sessions = sessionsByDay[cell.key] ?? [];
              const nameCount =
                sessions.length <= MAX_CALENDAR_LINES ? sessions.length : MAX_CALENDAR_LINES - 1;
              const hidden = sessions.length - nameCount;
              const today = cell.key === todayKey;
              return (
                <div
                  key={cell.key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                    padding: "8px 8px 0",
                    gap: 3,
                    borderTop: `1px solid ${COLOR.line}`,
                    borderLeft: cell.weekday === 0 ? "none" : `1px solid ${COLOR.line}`,
                    background: cell.inMonth ? COLOR.surface : COLOR.canvas,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "flex-start",
                      minWidth: 26,
                      height: 26,
                      padding: "0 6px",
                      borderRadius: 13,
                      fontSize: 15,
                      fontWeight: 700,
                      background: today ? COLOR.primary : "transparent",
                      color: dayNumberColor({
                        today,
                        inMonth: cell.inMonth,
                        weekday: cell.weekday,
                        holiday: Boolean(holidays[cell.key]),
                      }),
                    }}
                  >
                    {cell.day}
                  </div>
                  {sessions.slice(0, nameCount).map((session) => (
                    <div
                      key={session.id}
                      style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          flexShrink: 0,
                          borderRadius: 3,
                          background: COLOR.primary,
                        }}
                      />
                      <div
                        style={{
                          display: "block",
                          flex: 1,
                          minWidth: 0,
                          fontSize: 14,
                          lineHeight: 1.2,
                          lineClamp: 1,
                          color: cell.inMonth ? COLOR.ink : COLOR.hint,
                        }}
                      >
                        {session.title}
                      </div>
                    </div>
                  ))}
                  {hidden > 0 && (
                    <div
                      style={{ display: "flex", paddingLeft: 11, fontSize: 14, color: COLOR.hint }}
                    >
                      +{hidden}건
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>,
    {
      width: WIDTH,
      height,
      fonts: [
        { name: "Pretendard", data: await loadPretendard(400), weight: 400 },
        { name: "Pretendard", data: await loadPretendard(700), weight: 700 },
      ],
    },
  );
  return image.arrayBuffer();
}
