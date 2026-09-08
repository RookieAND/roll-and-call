import { TextInput } from "@trpg/ui";

// GET 폼 제출로 /games?q= 이동. 정렬은 hidden으로 유지, 페이지는 1로 초기화된다.
export function GameSearchForm({ q, sort }: { q?: string; sort?: string }) {
  return (
    <form action="/games" method="get">
      {sort && <input type="hidden" name="sort" value={sort} />}
      <TextInput name="q" defaultValue={q} placeholder="게임명 검색" />
    </form>
  );
}
