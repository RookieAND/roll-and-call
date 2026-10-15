import type { RulebookRequestRow, RulebookRow } from "@/entities/rulebook/server";
import { MobileAddRulebookForm } from "@/features/write-rulebook";
import { AdminHeader } from "@/shared/ui";

interface RulebookNewMobileViewProps {
  rulebooks: RulebookRow[];
  request: RulebookRequestRow | null;
  initialCategory?: string;
  viewerId: string;
}

export function RulebookNewMobileView({
  rulebooks,
  request,
  initialCategory,
  viewerId,
}: RulebookNewMobileViewProps) {
  return (
    <>
      <AdminHeader
        title={request ? "룰북 추가 심사하기" : "룰북 추가"}
        trail={[{ href: request ? "/rules?tab=requests" : "/rules", label: "룰북 카탈로그" }]}
      />
      <MobileAddRulebookForm
        rulebooks={rulebooks}
        request={request}
        initialCategory={initialCategory}
        viewerId={viewerId}
      />
    </>
  );
}
