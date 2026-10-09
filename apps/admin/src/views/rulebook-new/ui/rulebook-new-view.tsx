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
        title={request ? "룰북 추가 심사하기" : "룰북 추가"}
        trail={[{ href: request ? "/rules?tab=requests" : "/rules", label: "룰북 카탈로그" }]}
        contentWidth
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
