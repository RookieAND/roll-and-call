import { VARIABLE_PATTERN } from "./render-message-head";

// 임베드 설명 문장 하나가 한 줄이다. 코드의 분기(참여/대기, 확정/변경 등)와 1:1이라 키를 나눈다.
// 추첨 안내·가능 시간 안내·취소 사유처럼 시스템이 붙이는 줄은 서버가 바꾸지 않는다.
export const MESSAGE_TEXTS = [
  {
    key: "apply",
    caseKey: "apply",
    label: "참여했어요",
    body: "{참여자}님이 참여했어요.",
    extra: ["참여자"],
  },
  {
    key: "apply_waiting",
    caseKey: "apply",
    label: "대기열에 등록했어요",
    body: "{참여자}님이 대기열에 등록했어요.",
    extra: ["참여자"],
  },
  {
    key: "leave",
    caseKey: "leave",
    label: "참여를 취소했어요",
    body: "{참여자}님이 참여를 취소했어요.",
    extra: ["참여자"],
  },
  {
    key: "leave_gm",
    caseKey: "leave",
    label: "GM이 제외했어요",
    body: "{참여자}님이 참여 목록에서 제외됐어요.",
    extra: ["참여자"],
  },
  {
    key: "leave_server",
    caseKey: "leave",
    label: "서버를 나가 취소됐어요",
    body: "{참여자}님이 디스코드 서버를 나가 참여가 취소되었습니다.",
    extra: ["참여자"],
  },
  {
    key: "moved_waiting",
    caseKey: "leave",
    label: "대기로 옮겨졌어요",
    body: "{참여자}님이 대기로 옮겨졌어요.",
    extra: ["참여자"],
  },
  {
    key: "direct",
    caseKey: "direct",
    label: "직접 확정했어요",
    body: "GM이 {확정자}님을 참여자로 확정했어요.",
    extra: ["확정자"],
  },
  {
    key: "draw",
    caseKey: "draw",
    label: "추첨이 끝났어요",
    body: "추첨이 끝났어요. 신청한 {신청 수}명 중 {확정 수}명이 확정됐어요.",
    extra: ["신청 수", "확정 수"],
  },
  {
    key: "time",
    caseKey: "time",
    label: "시간이 확정됐어요",
    body: "세션 시간이 확정됐어요.",
    extra: [],
  },
  {
    key: "time_changed",
    caseKey: "time",
    label: "시간이 변경됐어요",
    body: "세션 시간이 변경됐어요.",
    extra: [],
  },
  {
    key: "done",
    caseKey: "done",
    label: "구인이 완료됐어요",
    body: "구인이 완료됐어요!",
    extra: [],
  },
  {
    key: "remind",
    caseKey: "remind",
    label: "곧 시작해요",
    body: "세션이 곧 시작해요!",
    extra: [],
  },
  {
    key: "cancel_gm",
    caseKey: "cancel",
    label: "GM이 취소했어요",
    body: "GM이 세션을 취소했어요.",
    extra: [],
  },
  {
    key: "cancel_staff",
    caseKey: "cancel",
    label: "운영진이 취소했어요",
    body: "운영진이 취소한 구인입니다.",
    extra: [],
  },
  {
    key: "cancel_auto",
    caseKey: "cancel",
    label: "서버를 나가 취소됐어요",
    body: "GM이 디스코드 서버를 나가 취소된 구인입니다.",
    extra: [],
  },
] as const;

export type MessageTextKey = (typeof MESSAGE_TEXTS)[number]["key"];

export const MESSAGE_TEXT_MAX_LENGTH = 300;

const BASE_VARIABLES = ["구인 제목", "GM", "룰", "링크"] as const;

const textOf = (key: MessageTextKey) => MESSAGE_TEXTS.find((text) => text.key === key)!;

export function defaultMessageText(key: MessageTextKey): string {
  return textOf(key).body;
}

export function messageTextVariables(key: MessageTextKey): readonly string[] {
  return [...BASE_VARIABLES, ...textOf(key).extra];
}

// 이 경우(MESSAGE_CASES)에 속한 설명 문장들. 어드민이 경우 아래에 칸을 늘어놓는다.
export function messageTextsOfCase(caseKey: string) {
  return MESSAGE_TEXTS.filter((text) => text.caseKey === caseKey);
}

// 저장을 막는 오류. 비우면 기본 문장으로 되돌리므로 빈 값은 막지 않는다.
export function validateMessageText({ key, text }: { key: MessageTextKey; text: string }) {
  if (/@(everyone|here)/i.test(text)) return "@everyone과 @here는 쓸 수 없습니다.";
  const allowed = messageTextVariables(key);
  const unknown = [...text.matchAll(VARIABLE_PATTERN)].find(
    (match) => !allowed.includes(match[1] ?? ""),
  );
  if (unknown) return `{${unknown[1]}}는 쓸 수 없는 변수입니다.`;
  if ([...text].length > MESSAGE_TEXT_MAX_LENGTH)
    return `${MESSAGE_TEXT_MAX_LENGTH}자까지 쓸 수 있습니다.`;
  return undefined;
}
