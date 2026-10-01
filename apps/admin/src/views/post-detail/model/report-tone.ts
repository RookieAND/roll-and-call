import type { PostDetail } from "@/shared/server";

const SPOILER = "스포일러";

export function reportTone(report: PostDetail["reports"][number]) {
  if (report.resolved) return "gray";
  if (report.category === SPOILER) return "warning";
  return "danger";
}
