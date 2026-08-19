import Link from "next/link";
import { SessionCard, type SessionCardModel } from "@/entities/game";

// SessionCard(표시) + 상세 링크(동작)를 조합한 목록. 마이페이지·세션 목록 공용.
export function SessionList({ items }: { items: SessionCardModel[] }) {
  return (
    <div className="flex flex-col gap-[9px]">
      {items.map((model) => (
        <Link key={model.id} href={model.href} className="block">
          <SessionCard model={model} />
        </Link>
      ))}
    </div>
  );
}
