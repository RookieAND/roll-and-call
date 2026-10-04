import type { MyRulebook, MyRulebooks } from "@/entities/rulebook";
import { toKst } from "@/shared/lib";

import { addedWithoutCert } from "./added-without-cert";
import type { ListRow } from "./list-row";

type Request = MyRulebooks["requests"][number];

export function toRequestRow({
  request,
  rulebooks,
}: {
  request: Request;
  rulebooks: MyRulebook[];
}): ListRow {
  const base = { key: request.id, icon: null, title: request.label };
  if (request.outcome === "added" || request.outcome === "linked") {
    return {
      ...base,
      tone: "success",
      sub: addedWithoutCert({ request, rulebooks })
        ? "인증 없이 구인을 열 수 있습니다"
        : "이제 인증을 신청할 수 있습니다",
      badge: { label: "추가됨", palette: "success" },
    };
  }
  if (request.outcome === "rejected") {
    return {
      ...base,
      tone: "gray",
      sub: `${toKst(request.processedAt!).format("MM.DD")} 처리`,
      note: request.rejectReason ?? undefined,
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
