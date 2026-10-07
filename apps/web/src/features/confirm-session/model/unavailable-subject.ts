import { topicParticle } from "@/shared/lib";

const LISTED_NAME_LIMIT = 2;

// 「오세진은」, 「오세진, 정민서는」, 「오세진 외 2인은」. 조사는 마지막 이름(또는 「인」)의 받침으로 고른다.
export function unavailableSubject(names: string[]): string {
  const subject =
    names.length > LISTED_NAME_LIMIT ? `${names[0]} 외 ${names.length - 1}인` : names.join(", ");
  return `${subject}${topicParticle(subject)}`;
}
