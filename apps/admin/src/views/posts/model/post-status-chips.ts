import { POST_STATUS } from "@/shared/lib";

// 모바일 상태 칩. 「숨김」은 상태가 아니라 운영진 조치로 거른다(selectPostRows).
export const POST_STATUS_CHIPS = [
  POST_STATUS.recruiting,
  POST_STATUS.scheduling,
  POST_STATUS.confirmed,
  POST_STATUS.ended,
  "숨김",
].map((value) => ({ label: value, value }));
