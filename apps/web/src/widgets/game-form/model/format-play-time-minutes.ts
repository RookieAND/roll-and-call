import { compact } from "es-toolkit";
export function formatPlayTimeMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return compact([hours ? `${hours}시간` : "", minutes ? `${minutes}분` : ""]).join(" ");
}
