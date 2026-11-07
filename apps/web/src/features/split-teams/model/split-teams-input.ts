import { z } from "zod";

import { SCHEDULE_MODE } from "@/entities/game";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HOUR = z.number().int().min(0).max(23);
// 구인 등록의 정원 상한과 같다.
const MAX_PLAYERS = 20;

const scheduleSchema = z.discriminatedUnion("scheduleMode", [
  z.object({
    scheduleMode: z.literal(SCHEDULE_MODE.coordinate),
    rangeStart: z.string().regex(DATE),
    rangeEnd: z.string().regex(DATE),
    windowStartHour: HOUR,
    windowEndHour: HOUR,
  }),
  z.object({
    scheduleMode: z.literal(SCHEDULE_MODE.fixed),
    startsAt: z.iso.datetime({ offset: true }),
  }),
]);

export const splitTeamsInputSchema = z.object({
  fromGameId: z.uuid(),
  userIds: z.array(z.uuid()).min(1).max(MAX_PLAYERS),
  maxPlayers: z.number().int().min(1).max(MAX_PLAYERS),
  schedule: scheduleSchema,
});

export type SplitTeamsInput = z.input<typeof splitTeamsInputSchema>;
export type SplitTeamsScheduleInput = z.output<typeof scheduleSchema>;
