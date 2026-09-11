import type { UseFormReturn } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";
// 위저드·단일 페이지 두 레이아웃이 공유하는 입력. 폼 상태와 제출은 GameForm이 소유한다.
export type GameFormLayoutProps = {
  form: UseFormReturn<GameFormValues>;
  pending: boolean;
  submitLabel: string;
  defaultPlayTime?: string | null;
  onValid: (values: GameFormValues) => void;
};
