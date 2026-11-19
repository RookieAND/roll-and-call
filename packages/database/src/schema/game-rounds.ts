import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { games, participants } from "./games";
import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 회차의 진행 단계. unscheduled는 일시가 아직 없고, coordinating은 가능 시간을 모으는 중이다.
// 다시 조율하는 동안에도 원래 일시(startAt)를 지키므로 coordinating이면서 startAt이 있을 수 있다.
export const roundStatus = pgEnum("round_status", [
  "unscheduled",
  "coordinating",
  "scheduled",
  "in_progress",
  "finished",
  "cancelling",
]);

// 구인 하나의 회차들. 단발도 회차 1개를 가진다. 일시·출석·후기는 회차 단위다.
// (game_id, round_no)의 유일 조건은 회차 생략 때 뒤 번호를 한 문장으로 당길 수 있게 0136에서 지연 제약으로 바꾼다.
// 같은 구인의 회차끼리 겹치지 않는 조건(exclusion)도 0136에서 건다. drizzle이 표현하지 못한다.
export const gameRounds = pgTable(
  "game_rounds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    roundNo: smallint("round_no").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }),
    plannedEndAt: timestamp("planned_end_at", { withTimezone: true }),
    // GM이 회차 마치기를 누른 시각. null이면 plannedEndAt이 종료다.
    endedAt: timestamp("ended_at", { withTimezone: true }),
    status: roundStatus("status").notNull().default("unscheduled"),
    // 가능 시간을 모으는 기간과 시간대(IANA 이름). 조율하지 않는 회차는 비어 있다.
    coordinationStart: date("coordination_start"),
    coordinationEnd: date("coordination_end"),
    coordinationTimezone: text("coordination_timezone"),
    // 조율 기간의 하루 시간대(시). 끝이 시작 이하이면 자정을 넘긴다. 다음 회차를 열 때 이 값을 기본으로 쓴다.
    coordinationWindowStartHour: smallint("coordination_window_start_hour"),
    coordinationWindowEndHour: smallint("coordination_window_end_hour"),
    attendanceConfirmedAt: timestamp("attendance_confirmed_at", { withTimezone: true }),
    // 다회차 회차의 1시간 전 알림을 보낸 시각(한 번만 보내는 표시). 단발은 games.notified_at을 쓴다.
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
    // 다회차 회차의 세션 시작 안내를 스레드에 올린 시각(한 번만 보내는 표시). 단발은 games.start_notified_at을 쓴다.
    startNotifiedAt: timestamp("start_notified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("game_rounds_game_id_round_no_unique").on(table.gameId, table.roundNo),
    // 출석·후기가 같은 구인의 회차인지 복합 FK로 확인한다.
    unique("game_rounds_id_game_id_unique").on(table.id, table.gameId),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "game_rounds_game_server_fk",
    }).onDelete("cascade"),
    index("game_rounds_server_id_start_at_idx")
      .on(table.serverId, table.startAt)
      .where(sql`start_at is not null`),
    check("game_rounds_round_no_positive", sql`${table.roundNo} >= 1`),
    check(
      "game_rounds_time_shape",
      sql`(${table.startAt} is null and ${table.plannedEndAt} is null) or (${table.startAt} is not null and ${table.plannedEndAt} > ${table.startAt} and ${table.plannedEndAt} - ${table.startAt} <= interval '24 hours')`,
    ),
    check(
      "game_rounds_status_has_time",
      sql`(${table.status} = 'unscheduled' and ${table.startAt} is null) or (${table.status} = 'coordinating') or (${table.status} not in ('unscheduled', 'coordinating') and ${table.startAt} is not null)`,
    ),
    check(
      "game_rounds_ended_after_start",
      sql`${table.endedAt} is null or (${table.startAt} is not null and ${table.endedAt} >= ${table.startAt})`,
    ),
    check(
      "game_rounds_coordination_range",
      sql`${table.coordinationEnd} is null or ${table.coordinationEnd} >= ${table.coordinationStart}`,
    ),
  ],
).enableRLS();

// 다회차에서 회차에 빠진 사람은 불참 기록 없이 attended = false로만 남는다.
export const roundAttendances = pgTable(
  "round_attendances",
  {
    serverId: serverId(),
    roundId: uuid("round_id").notNull(),
    gameId: uuid("game_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    attended: boolean("attended").notNull().default(true),
  },
  (table) => [
    primaryKey({ columns: [table.roundId, table.userId] }),
    foreignKey({
      columns: [table.roundId, table.gameId],
      foreignColumns: [gameRounds.id, gameRounds.gameId],
      name: "round_attendances_round_game_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.gameId, table.userId],
      foreignColumns: [participants.gameId, participants.userId],
      name: "round_attendances_participant_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "round_attendances_game_server_fk",
    }).onDelete("cascade"),
    index("round_attendances_user_id_idx").on(table.userId),
  ],
).enableRLS();

// 생략한 회차의 원래 일시. 어드민 상세에서만 보여 주고, 회차 행은 지운다.
export const gameRoundSkips = pgTable(
  "game_round_skips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serverId: serverId(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    roundNo: smallint("round_no").notNull(),
    originalStartAt: timestamp("original_start_at", { withTimezone: true }).notNull(),
    originalPlannedEndAt: timestamp("original_planned_end_at", { withTimezone: true }).notNull(),
    skippedAt: timestamp("skipped_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.gameId, table.serverId],
      foreignColumns: [games.id, games.serverId],
      name: "game_round_skips_game_server_fk",
    }).onDelete("cascade"),
    index("game_round_skips_game_id_idx").on(table.gameId),
  ],
).enableRLS();

export type GameRound = typeof gameRounds.$inferSelect;

export type NewGameRound = typeof gameRounds.$inferInsert;

export type RoundAttendance = typeof roundAttendances.$inferSelect;

export type GameRoundSkip = typeof gameRoundSkips.$inferSelect;
