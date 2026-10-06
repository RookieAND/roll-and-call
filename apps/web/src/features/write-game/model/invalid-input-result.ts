import { INVALID_INPUT_MESSAGE } from "./game-form";

const FIELD_ERROR_PATHS = ["minPlayers", "maxPlayers"];

// 클라이언트를 우회한 값도 폼 오류로 돌려준다. 최소 인원·정원 오류는 칸까지 알려 준다.
export function invalidInputResult(issue: { path: PropertyKey[]; message: string } | undefined) {
  const field = issue?.path.find((segment) => FIELD_ERROR_PATHS.includes(String(segment)));
  return {
    error: issue?.message ?? INVALID_INPUT_MESSAGE,
    ...(field ? { field: String(field) } : {}),
  };
}
