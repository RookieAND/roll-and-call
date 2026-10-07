import { z } from "zod";

import { GAME_TAG, RECRUIT_METHODS, SCHEDULE_MODE, SCHEDULE_MODES } from "@/entities/game";
import { richTextLength } from "@/shared/lib";

import { minPlayersRangeError } from "./min-players-range-error";
import { monthDayLabel } from "./month-day-label";

export const GAME_IMAGES_MAX = 5;
export const GAME_MAX_PLAYERS = 20;
export const GAME_TAGS_MAX = {
  [GAME_TAG.genres]: 5,
  [GAME_TAG.triggers]: 10,
  [GAME_TAG.platforms]: 5,
} as const;
export const GAME_TAG_MAX_LENGTH = 20;
export const GAME_NOTICE_MAX = 500;
export const GAME_SYNOPSIS_MAX = 2000;
export const INVALID_INPUT_MESSAGE = "입력값을 확인해 주세요.";

const tagList = (label: string, max: number) =>
  z
    .array(z.string().trim().min(1).max(GAME_TAG_MAX_LENGTH))
    .max(max, `${label}는 최대 ${max}개까지 넣을 수 있습니다.`);

// String-based (RHF-friendly: input type === output type). The server action
// re-validates and converts strings to DB types (Number/Date).
export const gameFormSchema = z
  .object({
    title: z.string().trim().min(1, "구인 제목을 입력해 주세요.").max(100),
    // rule은 고른 룰북의 이름(표시용)이고, 등록할 때 서버는 rulebookId로 룰북을 다시 찾는다.
    rule: z.string().trim().min(1, "룰북을 선택해 주세요.").max(100),
    rulebookId: z.string(),
    // 저장값은 리치 텍스트 JSON이라 문자 수는 본문 길이로 센다.
    synopsis: z
      .string()
      .max(GAME_SYNOPSIS_MAX * 20)
      .refine(
        (value) => richTextLength(value) <= GAME_SYNOPSIS_MAX,
        `시놉시스는 ${GAME_SYNOPSIS_MAX}자까지 쓸 수 있습니다.`,
      )
      .optional(),
    genres: tagList("장르", GAME_TAGS_MAX.genres),
    triggers: tagList("트리거", GAME_TAGS_MAX.triggers),
    platforms: tagList("사용 플랫폼", GAME_TAGS_MAX.platforms),
    notice: z
      .string()
      .max(GAME_NOTICE_MAX * 20)
      .refine(
        (value) => richTextLength(value) <= GAME_NOTICE_MAX,
        `주의 사항은 ${GAME_NOTICE_MAX}자까지 쓸 수 있습니다.`,
      )
      .optional(),
    aiImage: z.boolean({ error: "AI 이미지 사용 여부를 골라 주세요." }),
    playMinutes: z.number().int().min(1, "플레이타임을 0시간 0분으로 둘 수 없습니다."),
    maxPlayers: z.string().refine((value) => {
      const count = Number(value);
      return value !== "" && Number.isInteger(count) && count >= 1 && count <= GAME_MAX_PLAYERS;
    }, `1~${GAME_MAX_PLAYERS} 사이로 적어 주세요.`),
    // 비우면 최소 인원 없음. 범위(정원 이하)는 정원과 함께 보므로 superRefine에서 검사한다.
    minPlayers: z.string(),
    recruitMethod: z.enum(RECRUIT_METHODS),
    scheduleMode: z.enum(SCHEDULE_MODES),
    endDate: z.string().min(1, "모집 마감 기한을 입력해 주세요."),
    confirmedAt: z.string().optional(),
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
    const minPlayersError = minPlayersRangeError(values);
    if (minPlayersError) {
      context.addIssue({ code: "custom", message: minPlayersError, path: ["minPlayers"] });
    }
    if (values.scheduleMode === SCHEDULE_MODE.fixed && !values.confirmedAt) {
      context.addIssue({
        code: "custom",
        message: "세션 일시를 입력해 주세요.",
        path: ["confirmedAt"],
      });
    }
    // 문자열은 로컬 ISO라 사전순 비교가 곧 시간순이다. 마감은 세션 시작보다 앞서야 한다.
    // 두 줄 문구는 제출 버튼 위 안내가 줄마다 나눠 그린다.
    if (
      values.scheduleMode === SCHEDULE_MODE.fixed &&
      values.confirmedAt &&
      values.endDate >= values.confirmedAt
    ) {
      context.addIssue({
        code: "custom",
        message: `모집 마감이 세션 일시보다 늦습니다.\n마감을 ${monthDayLabel(values.confirmedAt)} 이전으로 바꿔 주세요.`,
        path: ["endDate"],
      });
    }
  });

export type GameFormValues = z.infer<typeof gameFormSchema>;

export type PreConfirmedPlayer = GameFormValues["preConfirmed"][number];
