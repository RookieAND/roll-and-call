import { AppError, ERROR_DISPLAY, type ActionResult } from "@/shared/api";

import { toast } from "./toast";

export type ActionHandlers<Result extends ActionResult> = {
  onSuccess?: (result: Result) => void;
  onError?: (result: Result & { error: string }) => void;
};

// page 에러는 throw한다. 트랜지션 안에서 부르면 가까운 ErrorBoundary가 받는다.
export function handleActionResult<Result extends ActionResult>({
  result,
  onSuccess,
  onError,
}: ActionHandlers<Result> & { result: Result }): boolean {
  if (!result.error) {
    onSuccess?.(result);
    return true;
  }
  if (result.errorDisplay === ERROR_DISPLAY.page) {
    throw new AppError(result.error, ERROR_DISPLAY.page);
  }
  if (onError) onError({ ...result, error: result.error });
  else toast.danger(result.error);
  return false;
}
