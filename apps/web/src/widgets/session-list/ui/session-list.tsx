import Link from "next/link";
import type { SessionCardModel } from "../model/session-card";
import { SessionCard } from "./session-card";
// SessionCard(표시) + 상세 링크(동작)를 조합한 목록. 마이페이지·세션 목록 공용.
// 진행 중인 세션의 GM은 상세 대신 참여자 관리로 바로 보낸다.
function sessionHref({ id, role, dim }: SessionCardModel): string {
  return role === "host" && !dim ? `/games/${id}/participants` : `/games/${id}`;
}

export function SessionList({ items }: { items: SessionCardModel[] }) {
  return (
    <div className="flex flex-col gap-[9px]">
      {items.map((model) => (
        <Link key={model.id} href={sessionHref(model)} className="block">
          <SessionCard model={model} />
        </Link>
      ))}
    </div>
  );
}
