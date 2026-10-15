import { unstable_rethrow } from "next/navigation";

interface RunActionSubmitOptions<Result> {
  run: () => Promise<Result>;
  setNetworkError: (networkError: boolean) => void;
}

// 업무 실패({ ok: false })는 그대로 돌려주고, 예외(네트워크 오류)만 undefined로 바꾼다.
export async function runActionSubmit<Result>({
  run,
  setNetworkError,
}: RunActionSubmitOptions<Result>): Promise<Result | undefined> {
  setNetworkError(false);
  try {
    return await run();
  } catch (error) {
    unstable_rethrow(error);
    setNetworkError(true);
    return undefined;
  }
}
