import { queryOptions } from "@tanstack/react-query";

import { searchCandidates } from "../api/search-candidates";
import { searchProfiles } from "../api/search-profiles";

export function candidateSearchQuery({
  gameId,
  keyword,
}: {
  gameId: string | undefined;
  keyword: string;
}) {
  return queryOptions({
    queryKey: ["candidate-search", gameId ?? null, keyword] as const,
    queryFn: () =>
      gameId ? searchCandidates({ gameId, query: keyword }) : searchProfiles(keyword),
  });
}
