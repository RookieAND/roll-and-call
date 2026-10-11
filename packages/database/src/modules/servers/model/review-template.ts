import { renderMessageHead, VARIABLE_PATTERN } from "./render-message-head";

// 후기 게시글의 제목과 본문 양식. server_message_texts 표에 이 두 키로 저장하고, 행이 없으면 아래 기본 양식을 쓴다.
export const REVIEW_TEMPLATE_KEYS = { title: "review_title", body: "review_body" } as const;

export type ReviewTemplatePart = keyof typeof REVIEW_TEMPLATE_KEYS;

export const REVIEW_TEMPLATE_LABEL = "후기";
// 어드민 디스코드 메시지 화면에서 후기 양식을 고르는 주소 값(case=review).
export const REVIEW_CASE_KEY = "review";
export const REVIEW_BODY_VARIABLE = "후기 본문";
export const REVIEW_TITLE_MAX_LENGTH = 100;
export const REVIEW_BODY_TEMPLATE_MAX_LENGTH = 1000;

// 기본 양식은 양식 기능이 생기기 전에 올리던 후기 게시글과 같은 모양이다.
export const DEFAULT_REVIEW_TEMPLATE: Record<ReviewTemplatePart, string> = {
  title: "{GM 후기 표시} {스포 표시} {구인 제목} 후기 · {작성자}",
  body: "{후기 본문}\n\n-# 작성자 {작성자 멘션} · 룰 {룰} · GM {GM} · {롤앤콜 링크}",
};

const TITLE_VARIABLES = [
  "구인 제목",
  "룰",
  "GM",
  "작성자",
  "후기 종류",
  "GM 후기 표시",
  "스포 표시",
] as const;

const BODY_VARIABLES = [
  ...TITLE_VARIABLES,
  REVIEW_BODY_VARIABLE,
  "작성자 멘션",
  "GM 멘션",
  "참여자 멘션",
  "롤앤콜 링크",
] as const;

export function reviewTemplateVariables(part: ReviewTemplatePart): readonly string[] {
  return part === "title" ? TITLE_VARIABLES : BODY_VARIABLES;
}

export function defaultReviewTemplate(part: ReviewTemplatePart) {
  return DEFAULT_REVIEW_TEMPLATE[part];
}

// 저장을 막는 오류. 비우면 기본 양식으로 되돌리므로 빈 값은 막지 않는다.
export function validateReviewTemplate({ part, text }: { part: ReviewTemplatePart; text: string }) {
  if (!text) return undefined;
  if (/@(everyone|here)/i.test(text)) return "@everyone과 @here는 쓸 수 없습니다.";
  const allowed = reviewTemplateVariables(part);
  const unknown = [...text.matchAll(VARIABLE_PATTERN)].find(
    (match) => !allowed.includes(match[1] ?? ""),
  );
  if (unknown) return `{${unknown[1]}}는 쓸 수 없는 변수입니다.`;
  const max = part === "title" ? REVIEW_TITLE_MAX_LENGTH : REVIEW_BODY_TEMPLATE_MAX_LENGTH;
  if ([...text].length > max) return `${max}자까지 쓸 수 있습니다.`;
  if (part === "body" && !text.includes(`{${REVIEW_BODY_VARIABLE}}`))
    return `{${REVIEW_BODY_VARIABLE}}가 있어야 후기가 올라갑니다.`;
  return undefined;
}

const BODY_PLACEHOLDER = "\u0000";

// 줄 끝에 남은 구분점(변수가 비어 생긴 「 · 」)을 지운다.
function dropTrailingSeparator(line: string) {
  return line.replace(/(?:\s*·)+\s*$/, "");
}

// 후기 본문은 공백을 줄이는 처리에서 빼고 마지막에 끼워 넣어, 후기에 쓴 줄바꿈과 들여쓰기를 그대로 둔다.
// 결과가 비면 빈 문자열을 돌려주므로 부르는 쪽이 기본 양식으로 다시 만든다.
export function renderReviewTemplate({
  template,
  values,
  reviewBody,
}: {
  template: string;
  values: Record<string, string | undefined>;
  reviewBody: string;
}) {
  const rendered = renderMessageHead({
    template,
    values: { ...values, [REVIEW_BODY_VARIABLE]: BODY_PLACEHOLDER },
  })
    .split("\n")
    .map(dropTrailingSeparator)
    .join("\n")
    .trim();
  return rendered.replace(BODY_PLACEHOLDER, () => reviewBody);
}
