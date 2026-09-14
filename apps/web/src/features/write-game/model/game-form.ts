import { z } from "zod";
import { SCHEDULE_MODE, SCHEDULE_MODES } from "@/entities/game";

// 세션 예정일 범위 상한(일). 스키마 검증과 달력 max가 같은 값을 본다.
export const GAME_RANGE_MAX_DAYS = 14;
// 진행 이미지 장수 상한. 스키마 검증과 업로드 칸 수가 같은 값을 본다.
export const GAME_IMAGES_MAX = 5;
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
      .refine((v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 20;
      }, "1~20 사이 인원을 입력하세요."),
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
  .superRefine((v, ctx) => {
    if (v.scheduleMode === SCHEDULE_MODE.fixed && !v.confirmedAt) {
      ctx.addIssue({
        code: "custom",
        message: "세션 일시를 입력하세요.",
        path: ["confirmedAt"],
      });
    }
    // 모집 마감은 세션이 시작되기 전이어야 한다(문자열은 로컬 ISO라 사전순 비교가 시간순).
    if (v.scheduleMode === SCHEDULE_MODE.fixed && v.confirmedAt && v.endDate > v.confirmedAt) {
      ctx.addIssue({
        code: "custom",
        message: "모집 마감은 세션 일시보다 이전이어야 합니다.",
        path: ["endDate"],
      });
    }
    if (
      v.scheduleMode === SCHEDULE_MODE.coordinate &&
      v.rangeEnd &&
      v.endDate.slice(0, 10) > v.rangeEnd
    ) {
      ctx.addIssue({
        code: "custom",
        message: "모집 마감은 조율 종료일보다 이전이어야 합니다.",
        path: ["endDate"],
      });
    }
    if (v.scheduleMode === SCHEDULE_MODE.coordinate) {
      if (!v.rangeStart) {
        ctx.addIssue({
          code: "custom",
          message: "시작일을 입력하세요.",
          path: ["rangeStart"],
        });
      }
      if (!v.rangeEnd) {
        ctx.addIssue({
          code: "custom",
          message: "종료일을 입력하세요.",
          path: ["rangeEnd"],
        });
      } else if (v.rangeStart && v.rangeEnd <= v.rangeStart) {
        ctx.addIssue({
          code: "custom",
          message: "종료일은 시작일보다 이후여야 합니다.",
          path: ["rangeEnd"],
        });
      } else if (v.rangeStart) {
        const days = (Date.parse(v.rangeEnd) - Date.parse(v.rangeStart)) / 86_400_000;
        if (days > GAME_RANGE_MAX_DAYS) {
          ctx.addIssue({
            code: "custom",
            message: `세션 예정일 범위는 최대 ${GAME_RANGE_MAX_DAYS}일까지 설정할 수 있습니다.`,
            path: ["rangeEnd"],
          });
        }
      }
    }
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;
