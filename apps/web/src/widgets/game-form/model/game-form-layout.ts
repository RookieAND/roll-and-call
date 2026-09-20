import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

import type { WizardStepConfig } from "./game-form-steps";

export type GameEditContext = {
  gameId: string;
  applicantCount: number;
  confirmedCount: number;
};

export interface GameFormLayoutProps {
  form: UseFormReturn<GameFormValues>;
  pending: boolean;
  submitLabel: string;
  onValid: (values: GameFormValues) => void;
  steps: readonly WizardStepConfig[];
  edit?: GameEditContext;
}
