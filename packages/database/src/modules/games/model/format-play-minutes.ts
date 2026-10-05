import { compact } from "es-toolkit";

// 분을 "3시간 30분"처럼 읽는 글로 바꾼다. 화면은 이 값만 쓰고 플레이 시간 원문은 따로 두지 않는다.
export function formatPlayMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return compact([hours ? `${hours}시간` : "", minutes ? `${minutes}분` : ""]).join(" ");
}
