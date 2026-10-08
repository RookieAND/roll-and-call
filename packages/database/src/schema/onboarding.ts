import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profiles } from "./profiles";
import { serverId } from "./server-id";

// 튜토리얼 퀘스트를 처음 깬 기록. 체험 결과는 서버에 남기지 않고 이 한 줄만 남긴다.
// RLS만 켜고 정책을 두지 않는다. 웹 서버(DATABASE_URL)만 읽고 쓴다.
export const onboardingQuestClears = pgTable(
  "onboarding_quest_clears",
  {
    serverId: serverId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    quest: text("quest").notNull(),
    clearedAt: timestamp("cleared_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.serverId, table.userId, table.quest] })],
).enableRLS();
