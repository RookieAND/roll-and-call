import { z } from "zod";

import { SCHEDULE_MODE, SCHEDULE_MODES } from "@/entities/game";

export const GAME_RANGE_MAX_DAYS = 14;
export const GAME_IMAGES_MAX = 5;
export const GAME_MAX_PLAYERS = 20;
export const INVALID_INPUT_MESSAGE = "입력값을 확인하세요.";

const DAY_MS = 86_400_000;

// String-based (RHF-friendly: input type === output type). The server action
// re-validates and converts strings to DB types (Number/Date).
export const gameFormSchema = z
  .object({
    title: z.string().trim().min(1, "게임명을 입력하세요.").max(100),
    rule: z.string().trim().min(1, "룰을 입력하세요.").max(100),
    synopsis: z.string().max(2000).optional(),
    playTime: z.string().max(100).optional(),
    maxPlayers: z
      .string()
      .min(1, "인원을 입력하세요.")
      .refine((value) => {
        const count = Number(value);
        return Number.isInteger(count) && count >= 1 && count <= GAME_MAX_PLAYERS;
      }, `1~${GAME_MAX_PLAYERS} 사이로 적어주세요.`),
    scheduleMode: z.enum(SCHEDULE_MODES),
    endDate: z.string().min(1, "모집 마감 기한을 입력하세요."),
    confirmedAt: z.string().optional(),
    rangeStart: z.string().optional(),
    rangeEnd: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    images: z
      .array(z.url())
      .max(GAME_IMAGES_MAX, `이미지는 최대 ${GAME_IMAGES_MAX}장까지 올릴 수 있습니다.`),
    waitlistEnabled: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.scheduleMode === SCHEDULE_MODE.fixed && !values.confirmedAt) {
      context.addIssue({
        code: "custom",
        message: "세션 일시를 입력하세요.",
        path: ["confirmedAt"],
      });
    }
    // 문자열은 로컬 ISO라 사전순 비교가 곧 시간순이다.
    if (
      values.scheduleMode === SCHEDULE_MODE.fixed &&
      values.confirmedAt &&
      values.endDate > values.confirmedAt
    ) {
      context.addIssue({
        code: "custom",
        message: "모집 마감은 세션 일시보다 이전이어야 합니다.",
        path: ["endDate"],
      });
    }
    if (
      values.scheduleMode === SCHEDULE_MODE.coordinate &&
      values.rangeEnd &&
      values.endDate.slice(0, 10) > values.rangeEnd
    ) {
      context.addIssue({
        code: "custom",
        message: "모집 마감은 조율 종료일보다 이전이어야 합니다.",
        path: ["endDate"],
      });
    }
    if (values.scheduleMode === SCHEDULE_MODE.coordinate) {
      if (!values.rangeStart) {
        context.addIssue({
          code: "custom",
          message: "시작일을 입력하세요.",
          path: ["rangeStart"],
        });
      }
      if (!values.rangeEnd) {
        context.addIssue({
          code: "custom",
          message: "종료일을 입력하세요.",
          path: ["rangeEnd"],
        });
      } else if (values.rangeStart && values.rangeEnd <= values.rangeStart) {
        context.addIssue({
          code: "custom",
          message: "종료일은 시작일보다 이후여야 합니다.",
          path: ["rangeEnd"],
        });
      } else if (values.rangeStart) {
        const days = (Date.parse(values.rangeEnd) - Date.parse(values.rangeStart)) / DAY_MS;
        if (days > GAME_RANGE_MAX_DAYS) {
          context.addIssue({
            code: "custom",
            message: `조율 기간은 최대 ${GAME_RANGE_MAX_DAYS}일까지 고를 수 있습니다.`,
            path: ["rangeEnd"],
          });
        }
      }
    }
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;
