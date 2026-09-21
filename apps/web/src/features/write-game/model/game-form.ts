import { z } from "zod";

import { RECRUIT_METHODS, SCHEDULE_MODE, SCHEDULE_MODES } from "@/entities/game";
import { richTextLength } from "@/shared/lib";

export const GAME_RANGE_MAX_DAYS = 14;
export const GAME_IMAGES_MAX = 5;
export const GAME_MAX_PLAYERS = 20;
export const GAME_TAGS_MAX = 5;
export const GAME_TAG_MAX_LENGTH = 20;
export const GAME_NOTICE_MAX = 500;
export const GAME_SYNOPSIS_MAX = 2000;
export const INVALID_INPUT_MESSAGE = "입력값을 확인하세요.";

const DAY_MS = 86_400_000;

const tagList = (label: string) =>
  z
    .array(z.string().trim().min(1).max(GAME_TAG_MAX_LENGTH))
    .max(GAME_TAGS_MAX, `${label}는 최대 ${GAME_TAGS_MAX}개까지 넣을 수 있습니다.`);

// String-based (RHF-friendly: input type === output type). The server action
// re-validates and converts strings to DB types (Number/Date).
export const gameFormSchema = z
  .object({
    title: z.string().trim().min(1, "게임명을 입력하세요.").max(100),
    rule: z.string().trim().min(1, "룰을 입력하세요.").max(100),
    // 저장값은 리치 텍스트 JSON이라 문자 수는 본문 길이로 센다.
    synopsis: z
      .string()
      .max(GAME_SYNOPSIS_MAX * 20)
      .refine(
        (value) => richTextLength(value) <= GAME_SYNOPSIS_MAX,
        `시놉시스는 ${GAME_SYNOPSIS_MAX}자까지 쓸 수 있습니다.`,
      )
      .optional(),
    genres: tagList("장르"),
    triggers: tagList("트리거"),
    platforms: tagList("사용 플랫폼"),
    notice: z.string().max(GAME_NOTICE_MAX).optional(),
    aiImage: z.boolean({ error: "AI 이미지 사용 여부를 골라주세요." }),
    playTime: z.string().min(1, "플레이타임을 0시간 0분으로 둘 수 없습니다.").max(100),
    maxPlayers: z
      .string()
      .min(1, "인원을 입력하세요.")
      .refine((value) => {
        const count = Number(value);
        return Number.isInteger(count) && count >= 1 && count <= GAME_MAX_PLAYERS;
      }, `1~${GAME_MAX_PLAYERS} 사이로 적어주세요.`),
    recruitMethod: z.enum(RECRUIT_METHODS),
    scheduleMode: z.enum(SCHEDULE_MODES),
    endDate: z.string().min(1, "모집 마감 기한을 입력하세요."),
    confirmedAt: z.string().optional(),
    rangeStart: z.string().optional(),
    rangeEnd: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    thumbnailSpoiler: z.boolean(),
    images: z
      .array(z.url())
      .max(GAME_IMAGES_MAX, `이미지는 최대 ${GAME_IMAGES_MAX}장까지 올릴 수 있습니다.`),
    waitlistEnabled: z.boolean(),
    // 등록과 함께 확정으로 넣을 사람. 서버는 userId만 쓰고 나머지는 목록 표시용이다.
    preConfirmed: z
      .array(
        z.object({
          userId: z.uuid(),
          username: z.string(),
          avatarUrl: z.string().nullable(),
          bio: z.string().nullable(),
        }),
      )
      .max(GAME_MAX_PLAYERS),
  })
  .superRefine((values, context) => {
    if (values.preConfirmed.length > Number(values.maxPlayers)) {
      context.addIssue({
        code: "custom",
        message: `직접 확정한 ${values.preConfirmed.length}명보다 줄일 수 없습니다.`,
        path: ["maxPlayers"],
      });
    }
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

export type PreConfirmedPlayer = GameFormValues["preConfirmed"][number];
