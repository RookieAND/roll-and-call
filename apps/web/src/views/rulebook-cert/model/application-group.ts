import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

export function applicationGroup({
  rulebook,
  rulebooks,
}: {
  rulebook: MyRulebook;
  rulebooks: MyRulebook[];
}) {
  const groupId = rulebook.latestApplication?.groupId;
  const books = groupId
    ? rulebooks.filter((candidate) => candidate.latestApplication?.groupId === groupId)
    : [rulebook];
  const kindOrder = Object.values(RULEBOOK_KIND);
  return books.toSorted(
    (left, right) => kindOrder.indexOf(left.kind) - kindOrder.indexOf(right.kind),
  );
}
