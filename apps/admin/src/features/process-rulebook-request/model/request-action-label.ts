import { REQUEST_ACTION } from "./request-action";

export const REQUEST_ACTION_LABEL = {
  [REQUEST_ACTION.add]: "룰북 추가 심사하기",
  [REQUEST_ACTION.link]: "기존 룰북에 연결",
  [REQUEST_ACTION.reject]: "요청 반려",
} as const;
