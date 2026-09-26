import type { MyRulebooks } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import type { ListRow } from "./list-row";

type Request = MyRulebooks["requests"][number];

// 추가 요청 한 줄. 처리된 요청은 30일 동안 결과를 보여 준다.
export function toRequestRow(request: Request): ListRow {
  const base = { key: request.id, icon: null, title: request.label };
  if (request.outcome === "added" || request.outcome === "linked") {
    return {
      ...base,
      tone: "success",
      sub: "이제 인증을 신청할 수 있습니다",
      badge: { label: "추가됨", palette: "success" },
    };
  }
  if (request.outcome === "rejected") {
    return {
      ...base,
      tone: "gray",
      sub: `${toKst(request.processedAt!).format("MM.DD")} 처리`,
      badge: { label: "추가하지 않음", palette: "gray" },
    };
  }
  return {
    ...base,
    tone: "gray",
    sub: `${toKst(request.createdAt).format("MM.DD")} 요청`,
    badge: { label: "검토 중", palette: "gray" },
  };
}
