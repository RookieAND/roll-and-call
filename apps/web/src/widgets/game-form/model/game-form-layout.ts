import type { UseFormReturn } from "react-hook-form";

import type { GameStatus } from "@/entities/game";
import type { MyRulebooks } from "@/entities/rulebook";
import type { GameFormValues } from "@/features/write-game";

import type { WizardStepConfig } from "./game-form-steps";
import type { ReopenContext } from "./reopen-context";

export type GameEditContext = {
  gameId: string;
  applicantCount: number;
  confirmedCount: number;
  drawn: boolean;
  minPlayers: number | null;
  // 저장된 구인의 상태. 위저드 요약 뱃지가 쓴다.
  status: GameStatus;
};

export interface GameFormLayoutProps {
  serverId: string;
  form: UseFormReturn<GameFormValues>;
  pending: boolean;
  submitLabel: string;
  onValid: (values: GameFormValues) => void;
  steps: readonly WizardStepConfig[];
  edit?: GameEditContext;
  rulebooks?: MyRulebooks;
  // 서플리먼트 목록을 만들 룰북. 수정은 룰을 바꿀 수 없어 rulebooks가 없으므로 따로 받는다.
  supplementRulebooks?: MyRulebooks;
  reopen?: ReopenContext;
}
