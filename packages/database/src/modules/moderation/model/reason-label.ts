import { isNil } from "es-toolkit";

// 저장한 사유 코드·글을 화면·알림·활동 기록에 보이는 글로 바꾼다. 글이 있으면 「{사유} · {글}」(기타면 「기타 · {입력}」)이다.
// 목록에 없는 코드는 코드를 그대로 보이고, 코드가 없으면 빈 글자다.
export function reasonLabel({
  code,
  text,
  reasons,
}: {
  code: string | null;
  text: string | null;
  reasons: Readonly<Record<string, string>>;
}) {
  if (isNil(code)) return "";
  const label = (Object.hasOwn(reasons, code) && reasons[code]) || code;
  return text ? `${label} · ${text}` : label;
}
