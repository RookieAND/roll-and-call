import { APPLICATION_QUESTION_MAX_LENGTH } from "@roll-and-call/database/games/model";
import { z } from "zod";

import { GAME_VISIBILITY, RECRUIT_METHODS, SCHEDULE_MODE } from "@/entities/game";

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

// 일반 모집의 최소 인원·신청글·모집 방식. 구인 등록의 칸과 같다. 지정 모집은 받지 않는다.
const recruitSchema = z.object({
  minPlayers: z.number().int().min(1).max(MAX_PLAYERS).nullable(),
  recruitMethod: z.enum(RECRUIT_METHODS),
  waitlistEnabled: z.boolean(),
  applicationNoteEnabled: z.boolean(),
  applicationQuestion: z.string().max(APPLICATION_QUESTION_MAX_LENGTH),
});

export const splitTeamsInputSchema = z.object({
  fromGameId: z.uuid(),
  userIds: z.array(z.uuid()).min(1).max(MAX_PLAYERS),
  maxPlayers: z.number().int().min(1).max(MAX_PLAYERS),
  visibility: z.enum([GAME_VISIBILITY.public, GAME_VISIBILITY.private]),
  // 일반 모집의 모집 마감. 지정 모집은 받지 않는다.
  endsAt: z.iso.datetime({ offset: true }).optional(),
  recruit: recruitSchema.optional(),
  schedule: scheduleSchema,
});

export type SplitTeamsInput = z.input<typeof splitTeamsInputSchema>;
export type SplitTeamsScheduleInput = z.output<typeof scheduleSchema>;
export type SplitTeamsRecruitInput = z.output<typeof recruitSchema>;
