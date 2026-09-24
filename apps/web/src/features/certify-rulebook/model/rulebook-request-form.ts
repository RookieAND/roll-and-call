import { z } from "zod";

export const rulebookRequestSchema = z.object({
  name: z.string().trim().min(1, "룰북 이름을 입력해 주세요.").max(100),
  edition: z.string().trim().min(1, "판본을 입력해 주세요.").max(50),
  publisher: z.string().trim().max(100),
  note: z.string().trim().max(200),
});

export type RulebookRequestValues = z.infer<typeof rulebookRequestSchema>;
