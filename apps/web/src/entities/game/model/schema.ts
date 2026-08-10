import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((v) => {
    const t = v?.trim();
    return t && t.length > 0 ? t : undefined;
  });

const emptyToUndefined = (v: unknown) => (v === "" || v == null ? undefined : v);

export const gameFormSchema = z
  .object({
    title: z.string().trim().min(1, "게임명을 입력하세요.").max(100),
    rule: z.string().trim().min(1, "룰을 입력하세요.").max(100),
    synopsis: optionalText,
    playTime: optionalText,
    maxPlayers: z.coerce
      .number()
      .int("인원은 정수로 입력하세요.")
      .min(1, "최소 1명 이상이어야 합니다.")
      .max(20, "최대 20명까지 가능합니다."),
    scheduleMode: z.enum(["fixed", "coordinate"]),
    endDate: z.preprocess(emptyToUndefined, z.coerce.date()),
    confirmedAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
    rangeStart: z.preprocess(emptyToUndefined, z.string().optional()),
    rangeEnd: z.preprocess(emptyToUndefined, z.string().optional()),
  })
  .superRefine((v, ctx) => {
    if (v.scheduleMode === "fixed" && !v.confirmedAt) {
      ctx.addIssue({
        code: "custom",
        message: "세션 일시를 입력하세요.",
        path: ["confirmedAt"],
      });
    }
    if (v.scheduleMode === "coordinate") {
      if (!v.rangeStart) {
        ctx.addIssue({
          code: "custom",
          message: "조율 시작일을 입력하세요.",
          path: ["rangeStart"],
        });
      }
      if (!v.rangeEnd) {
        ctx.addIssue({
          code: "custom",
          message: "조율 종료일을 입력하세요.",
          path: ["rangeEnd"],
        });
      }
    }
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;

export type GameFormState = { error: string } | null;
