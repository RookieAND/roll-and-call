import type { UseFormReturn } from "react-hook-form";

import type { GameFormValues } from "@/features/write-game";

export type GameEditContext = {
  gameId: string;
  applicantCount: number;
  confirmedCount: number;
};

export type GameFormLayoutProps = {
  form: UseFormReturn<GameFormValues>;
  pending: boolean;
  submitLabel: string;
  onValid: (values: GameFormValues) => void;
  edit?: GameEditContext;
};
