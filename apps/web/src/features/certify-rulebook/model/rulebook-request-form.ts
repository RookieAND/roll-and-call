import { z } from "zod";

// 종류를 모르면 unknown. 서플리먼트·핸드북이면 어느 룰의 책인지(category) 적는다.
export const REQUEST_KINDS = ["core", "supplement", "handbook", "unknown"] as const;

export const REQUEST_KIND_LABEL: Record<(typeof REQUEST_KINDS)[number], string> = {
  core: "기본 룰북",
  supplement: "서플리먼트",
  handbook: "핸드북",
  unknown: "잘 모르겠음",
};

export const rulebookRequestSchema = z.object({
  name: z.string().trim().min(1, "룰북 이름을 적어 주세요.").max(100),
  edition: z.string().trim().max(50),
  kind: z.enum(REQUEST_KINDS),
  category: z.string().trim().max(100),
  publisher: z.string().trim().max(100),
  note: z.string().trim().max(200),
});

export type RulebookRequestValues = z.infer<typeof rulebookRequestSchema>;

export function needsCategory(kind: RulebookRequestValues["kind"]) {
  return kind === "supplement" || kind === "handbook";
}
