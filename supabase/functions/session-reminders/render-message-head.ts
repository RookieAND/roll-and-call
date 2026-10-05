// 의존성이 없는 순수 모듈이다. supabase/functions/session-reminders/render-message-head.ts가 이 파일의 복사본이며
// render-message-head-copy.test.ts가 둘이 같은지 확인한다. 고치면 복사본도 같이 갈고 함수를 다시 배포한다.
export const VARIABLE_PATTERN = /\{([^}]+)\}/g;
export const ROLE_MENTION_PATTERN = /<@&(\d+)>/g;

// 변수 값이 비면 빈칸으로 바꾸고 앞뒤 공백을 하나로 줄인다. 결과가 비면 머리 줄 없이 보낸다.
export function renderMessageHead({
  template,
  values,
}: {
  template: string;
  values: Record<string, string | undefined>;
}) {
  return template
    .replace(VARIABLE_PATTERN, (_, name: string) => values[name] ?? "")
    .replace(/[^\S\n]+/g, " ")
    .trim();
}

export function roleMentionIds(text: string) {
  return [...text.matchAll(ROLE_MENTION_PATTERN)].flatMap((match) => match[1] ?? []);
}
