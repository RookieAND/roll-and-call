import { topicParticle } from "@/shared/lib";

import { abbreviatedNames } from "./abbreviated-names";

// 「오세진은」, 「오세진, 정민서는」, 「오세진 외 2인은」. 조사는 마지막 이름(또는 「인」)의 받침으로 고른다.
export function unavailableSubject(names: string[]): string {
  const subject = abbreviatedNames(names);
  return `${subject}${topicParticle(subject)}`;
}
