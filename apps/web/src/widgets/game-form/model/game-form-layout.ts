import type { UseFormReturn } from "react-hook-form";
import type { GameFormValues } from "@/features/write-game";

// 수정 화면에서만 알 수 있는 사실: 지금 신청자·확정자 수와 취소 시 돌아갈 곳.
export type GameEditContext = {
  gameId: string;
  applicantCount: number;
  confirmedCount: number;
};

// 위저드·단일 페이지 두 레이아웃이 공유하는 입력. 폼 상태와 제출은 GameForm이 소유한다.
export type GameFormLayoutProps = {
  form: UseFormReturn<GameFormValues>;
  pending: boolean;
  submitLabel: string;
  onValid: (values: GameFormValues) => void;
  edit?: GameEditContext;
};
