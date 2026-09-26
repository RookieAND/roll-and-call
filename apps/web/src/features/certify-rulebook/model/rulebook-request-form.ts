import { z } from "zod";

// 종류·카테고리·판본은 모두 "잘 모르겠음"을 고를 수 있다. 목록에 없는 카테고리는 적은 이름 그대로 보낸다.
export const UNKNOWN = "unknown" as const;
export const NEW_CATEGORY = "new" as const;

export const REQUEST_KINDS = ["core", "supplement", "handbook", UNKNOWN] as const;

export const REQUEST_KIND_LABEL: Record<(typeof REQUEST_KINDS)[number], string> = {
  core: "기본 룰북",
  supplement: "서플리먼트",
  handbook: "플레이어 책",
  unknown: "잘 모르겠음",
};

export const rulebookRequestSchema = z.object({
  name: z.string().trim().min(1, "룰북 이름을 적어 주세요.").max(100),
  edition: z.string().trim().max(50),
  kind: z.enum(REQUEST_KINDS),
  category: z.string().trim().max(100),
  link: z.union([z.literal(""), z.url("참고 링크는 주소 형식으로 적어 주세요.").max(500)]),
});

export type RulebookRequestValues = z.infer<typeof rulebookRequestSchema>;
