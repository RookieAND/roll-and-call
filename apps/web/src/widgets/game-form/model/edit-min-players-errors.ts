import { isMinPlayersRaise, MIN_PLAYERS_RAISE_MESSAGE } from "@/features/write-game";
import type { GameFormValues } from "@/features/write-game";

import type { GameEditContext } from "./game-form-layout";

type FieldErrors = Partial<Record<"minPlayers" | "maxPlayers", { type: string; message: string }>>;

// 수정 화면에서만 아는 최소 인원 오류. 신청자가 있으면 올릴 수 없고, 저장된 최소 인원보다 정원을 줄이면 정원 칸 오류다.
export function editMinPlayersErrors({
  values,
  edit,
}: {
  values: GameFormValues;
  edit: GameEditContext;
}): FieldErrors {
  if (values.minPlayers === "") return {};
  const next = Number(values.minPlayers);
  if (!Number.isInteger(next) || next < 1) return {};
  if (next === edit.minPlayers && Number(values.maxPlayers) < next) {
    return {
      maxPlayers: { type: "custom", message: `최소 인원 ${next}명보다 줄일 수 없습니다.` },
    };
  }
  if (edit.applicantCount > 0 && isMinPlayersRaise({ saved: edit.minPlayers, next })) {
    return { minPlayers: { type: "custom", message: MIN_PLAYERS_RAISE_MESSAGE } };
  }
  return {};
}
