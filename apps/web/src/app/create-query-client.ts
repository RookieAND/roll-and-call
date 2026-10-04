import { MutationCache, QueryClient } from "@tanstack/react-query";
import { isString, isUndefined } from "es-toolkit";

import { isPageError, NAV_BADGES_QUERY_ROOT } from "@/shared/api";
import { reportError } from "@/shared/ui";

const STALE_TIME_MS = 30_000;

export function createQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: [NAV_BADGES_QUERY_ROOT] });
      },
      onError: (error, _variables, _context, mutation) => {
        if (isPageError(error)) return;
        const errorMessage = mutation.meta?.errorMessage;
        reportError({
          error,
          fallbackMessage: isString(errorMessage) ? errorMessage : undefined,
        });
      },
    }),
    defaultOptions: {
      queries: {
        // 서버가 준 initialData를 곧바로 다시 받지 않게 한다.
        staleTime: STALE_TIME_MS,
        // 이미 보여 줄 데이터가 있으면 재조회 실패로 화면(과 편집 중인 상태)을 날리지 않는다.
        throwOnError: (_error, query) => isUndefined(query.state.data),
      },
      mutations: { throwOnError: isPageError },
    },
  });
  return queryClient;
}
