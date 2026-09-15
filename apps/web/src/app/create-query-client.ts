import { MutationCache, QueryClient } from "@tanstack/react-query";

import { isPageError } from "@/shared/api";
import { reportError } from "@/shared/ui";

const STALE_TIME_MS = 30_000;

export function createQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (isPageError(error)) return;
        const errorMessage = mutation.meta?.errorMessage;
        reportError(error, typeof errorMessage === "string" ? errorMessage : undefined);
      },
    }),
    defaultOptions: {
      queries: {
        // 서버가 준 initialData를 곧바로 다시 받지 않게 한다.
        staleTime: STALE_TIME_MS,
        // 이미 보여 줄 데이터가 있으면 재조회 실패로 화면(과 편집 중인 상태)을 날리지 않는다.
        throwOnError: (_error, query) => query.state.data === undefined,
      },
      mutations: { throwOnError: isPageError },
    },
  });
}
