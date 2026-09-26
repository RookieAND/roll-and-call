import { z } from "zod";

// 종류·카테고리·판본은 모두 "잘 모르겠음"으로 보낼 수 있다(판본은 비우면 모름). 목록에 없는 카테고리는 적은 이름 그대로 보낸다.
export const UNKNOWN = "unknown" as const;
export const NEW_CATEGORY = "new" as const;

export const REQUEST_KINDS = ["core", "supplement", "handbook", UNKNOWN] as const;

// 종류는 셋 가운데 고르고, 고르지 않으면 "잘 모르겠음"으로 보낸다.
export const REQUEST_KIND_CARDS = [
  {
    value: "core",
    title: "기본 룰북",
    description: "같은 판본의 기본 룰북을 모두 인증하면 GM이 될 수 있습니다",
  },
  {
    value: "supplement",
    title: "서플리먼트",
    description: "같은 판본의 기본 룰북을 인증한 뒤에 신청할 수 있습니다",
  },
  {
    value: "handbook",
    title: "플레이어 책",
    description: "인증해도 GM 자격은 생기지 않는 플레이어용 책입니다",
  },
] as const;

export const rulebookRequestSchema = z.object({
  name: z.string().trim().min(1, "룰북 이름을 적어 주세요.").max(100),
  edition: z.string().trim().max(50),
  kind: z.enum(REQUEST_KINDS),
  category: z.string().trim().max(100),
  link: z.union([z.literal(""), z.url("참고 링크는 주소 형식으로 적어 주세요.").max(500)]),
});

export type RulebookRequestValues = z.infer<typeof rulebookRequestSchema>;
