import { AddRulebookForm } from "@/features/write-rulebook";
import type { RulebookRequestRow, RulebookRow } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface RulebookNewViewProps {
  rulebooks: RulebookRow[];
  request: RulebookRequestRow | null;
  initialCategory?: string;
  viewerId: string;
}

export function RulebookNewView({
  rulebooks,
  request,
  initialCategory,
  viewerId,
}: RulebookNewViewProps) {
  return (
    <>
      <AdminHeader
        title={request ? "새 룰북으로 추가" : "룰북 추가"}
        sub={request ? "추가 요청 처리" : "책 한 권 등록"}
        trail={[{ href: request ? "/rules?tab=requests" : "/rules", label: "룰북" }]}
      />
      <AddRulebookForm
        rulebooks={rulebooks}
        request={request}
        initialCategory={initialCategory}
        viewerId={viewerId}
      />
    </>
  );
}
