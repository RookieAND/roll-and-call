import { VARIABLE_PATTERN } from "./render-message-head";

// 시안 s16.jsx의 경우 10개에 세션 종료 안내를 더했다. 임베드와 버튼은 고치지 않고 머리 줄만 정한다.
export const MESSAGE_CASES = [
  { key: "open", label: "구인 개설", to: "모집 채널" },
  { key: "apply", label: "참가 신청", to: "구인 스레드" },
  { key: "leave", label: "참여 취소·제외", to: "구인 스레드" },
  { key: "direct", label: "참여자 직접 확정", to: "구인 스레드" },
  { key: "draw", label: "추첨 결과", to: "구인 스레드" },
  { key: "time", label: "세션 시간 확정·변경", to: "구인 스레드" },
  { key: "done", label: "구인 완료", to: "완료 채널" },
  { key: "remind", label: "1시간 전 알림", to: "구인 스레드" },
  { key: "end", label: "세션 종료 안내", to: "구인 스레드" },
  { key: "cancel", label: "구인 취소", to: "구인 스레드" },
  { key: "monthly", label: "이달의 GM·PL 발표", to: "공지 채널" },
] as const;

export type MessageCaseKey = (typeof MESSAGE_CASES)[number]["key"];

export const MESSAGE_HEAD_MAX_LENGTH = 300;

// 행이 없을 때 쓰는 기본 머리 줄. 앞에 📢를 붙인다.
export const DEFAULT_MESSAGE_HEADS: Partial<Record<MessageCaseKey, string>> = {
  open: "📢 새로운 구인 글이 올라왔어요!",
  apply: "📢 {구인 제목} 참가 신청이 들어왔어요!",
  leave: "📢 {구인 제목} 참여자가 바뀌었어요.",
  direct: "📢 {구인 제목} 참여자가 확정됐어요!",
  draw: "📢 {구인 제목} 추첨 결과가 나왔어요!",
  time: "📢 {구인 제목} 세션 시간이 정해졌어요!",
  done: "📢 {구인 제목} 모집이 완료됐어요!",
  // supabase/functions/session-reminders/index.ts의 DEFAULT_HEAD와 같아야 한다.
  remind: "📢 {구인 제목} 세션이 곧 시작해요!",
  end: "📢 {구인 제목} 세션이 끝났어요!",
  cancel: "📢 {구인 제목} 구인이 취소됐어요.",
  monthly: "📢 {달}에 활약한 분들을 소개해요!",
};

const BASE_VARIABLES = ["구인 제목", "GM", "룰", "링크"] as const;

export function messageVariables(key: MessageCaseKey): readonly string[] {
  if (key === "done") return [...BASE_VARIABLES, "참여자 멘션"];
  if (key === "monthly") return ["달"];
  return BASE_VARIABLES;
}

export function defaultMessageHead(key: MessageCaseKey) {
  return DEFAULT_MESSAGE_HEADS[key] ?? "";
}

// 저장을 막는 오류. 없는 역할은 경고라 여기서 다루지 않는다(화면이 길드 역할과 대조한다).
export function validateMessageHead({ key, text }: { key: MessageCaseKey; text: string }) {
  if (/@(everyone|here)/i.test(text)) return "@everyone과 @here는 쓸 수 없습니다.";
  const allowed = messageVariables(key);
  const unknown = [...text.matchAll(VARIABLE_PATTERN)].find(
    (match) => !allowed.includes(match[1] ?? ""),
  );
  if (unknown) return `{${unknown[1]}}는 쓸 수 없는 변수입니다.`;
  if ([...text].length > MESSAGE_HEAD_MAX_LENGTH)
    return `${MESSAGE_HEAD_MAX_LENGTH}자까지 쓸 수 있습니다.`;
  return undefined;
}
