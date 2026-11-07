import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { z } from "zod";

import { idSchema } from "@/shared/api";

const TEXT_INPUT_MAX = 1000;

// 길이·개수만 본다. 필수 입력·링크 형식·이미지 주인은 homebrewInputError가 칸별 문구로 알린다.
export const homebrewInputSchema = z.object({
  name: z.string().max(HOMEBREW_LIMIT.nameLength),
  edition: z.string().max(HOMEBREW_LIMIT.nameLength),
  summary: z.string().max(HOMEBREW_LIMIT.summaryLength),
  links: z.array(z.string().max(TEXT_INPUT_MAX)).max(HOMEBREW_LIMIT.links),
  imageUrls: z.array(z.string().max(TEXT_INPUT_MAX)).max(HOMEBREW_LIMIT.images),
  previousId: idSchema.nullable(),
});

export type HomebrewInput = z.output<typeof homebrewInputSchema>;
