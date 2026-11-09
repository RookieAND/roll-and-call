import {
  RULEBOOK_REQUEST_MAX_BOOKS,
  rulebookRequestKey,
} from "@roll-and-call/database/rulebooks/model";
import { z } from "zod";

export const UNKNOWN = "unknown" as const;
export const NEW_CATEGORY = "new" as const;

export const REQUEST_KINDS = ["core", "supplement", "handbook", UNKNOWN] as const;

export const REQUEST_KIND_CARDS = [
  {
    value: "core",
    title: "기본 룰북",
    description: "한 판본의 기본 룰북을 모두 인증하면 그 판본의 GM이 될 수 있습니다",
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
  link: z.union([z.literal(""), z.url("참고 링크는 주소 형식으로 적어야 합니다.").max(500)]),
});

export type RulebookRequestValues = z.infer<typeof rulebookRequestSchema>;

export const rulebookRequestsSchema = z.object({
  items: z
    .array(rulebookRequestSchema.extend({ clientId: z.string().min(1).max(100) }))
    .min(1, "요청할 책을 추가해 주세요.")
    .max(
      RULEBOOK_REQUEST_MAX_BOOKS,
      `한 번에 ${RULEBOOK_REQUEST_MAX_BOOKS}권까지 요청할 수 있습니다.`,
    )
    .refine(
      (items) => new Set(items.map((item) => item.clientId)).size === items.length,
      "입력 항목을 확인해 주세요.",
    ),
});

export type RulebookRequestsInput = z.infer<typeof rulebookRequestsSchema>;
export type RequestItemError = { clientId: string; message: string };
export type RequestDetails = Omit<RulebookRequestValues, "name">;
export type RequestDraft = RulebookRequestsInput["items"][number];

export function newRequestDraft(clientId: string, name = ""): RequestDraft {
  return { clientId, name, category: "", edition: "", kind: UNKNOWN, link: "" };
}

export function duplicateRequestErrors(
  items: RulebookRequestsInput["items"],
  pendingNames: string[] = [],
): RequestItemError[] {
  const counts = new Map<string, number>();
  const pending = new Set(pendingNames.map((name) => name.trim().toLowerCase()));
  for (const item of items) {
    const key = rulebookRequestKey({ name: item.name.trim(), edition: item.edition.trim() });
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return items.flatMap((item) => {
    const key = rulebookRequestKey({ name: item.name.trim(), edition: item.edition.trim() });
    if (!item.name.trim()) return [];
    if (pending.has(key))
      return [
        { clientId: item.clientId, message: "이미 검토 중인 룰북입니다. 이 항목을 제외해 주세요." },
      ];
    if ((counts.get(key) ?? 0) > 1)
      return [{ clientId: item.clientId, message: "같은 이름과 판본의 책이 두 번 들어 있습니다." }];
    return [];
  });
}
