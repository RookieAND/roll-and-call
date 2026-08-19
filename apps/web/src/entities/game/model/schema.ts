import { z } from "zod";
import { SCHEDULE_MODE, SCHEDULE_MODES } from "./schedule-mode";

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
  })
  .superRefine((v, ctx) => {
    if (v.scheduleMode === SCHEDULE_MODE.fixed && !v.confirmedAt) {
      ctx.addIssue({
        code: "custom",
        message: "세션 일시를 입력하세요.",
        path: ["confirmedAt"],
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
        const days =
          (Date.parse(v.rangeEnd) - Date.parse(v.rangeStart)) / 86_400_000;
        if (days > 14) {
          ctx.addIssue({
            code: "custom",
            message: "세션 예정일 범위는 최대 2주까지 설정할 수 있습니다.",
            path: ["rangeEnd"],
          });
        }
      }
    }
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;

// error → show inline; redirect → client navigates (toast is called client-side)
export type GameFormState = { error?: string; redirect?: string } | null;
