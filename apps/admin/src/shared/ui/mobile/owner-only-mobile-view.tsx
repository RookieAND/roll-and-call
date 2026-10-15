import { AdminHeader } from "../admin-header";
import { EmptyState } from "../empty-state";

interface OwnerOnlyMobileViewProps {
  title: string;
  scope: string;
  ownerNickname?: string;
}

export function OwnerOnlyMobileView({ title, scope, ownerNickname }: OwnerOnlyMobileViewProps) {
  const owner = ownerNickname ? `소유자(${ownerNickname})가` : "소유자가";
  return (
    <>
      <AdminHeader title={title} />
      <EmptyState
        title="소유자만 이용할 수 있습니다"
        description={`${scope}은 ${owner} 담당합니다.`}
        className="flex-1"
      />
    </>
  );
}
