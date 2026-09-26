import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

// 이 책과 함께 낸 책들(같은 groupId). 기본 룰북을 앞에 둔다.
export function applicationGroup(rulebook: MyRulebook, rulebooks: MyRulebook[]) {
  const groupId = rulebook.latestApplication?.groupId;
  const books = groupId
    ? rulebooks.filter((candidate) => candidate.latestApplication?.groupId === groupId)
    : [rulebook];
  const kindOrder = Object.values(RULEBOOK_KIND);
  return books.toSorted(
    (left, right) => kindOrder.indexOf(left.kind) - kindOrder.indexOf(right.kind),
  );
}
