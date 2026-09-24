import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { RulebookEditForm } from "@/features/write-rulebook";
import type { GrantCandidate, RulebookDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import { CertifiedGmPanel } from "./certified-gm-panel";
import { GrantDialogSlot } from "./grant-dialog-slot";

interface RulebookDetailViewProps {
  rulebook: RulebookDetail;
  grantCandidates: GrantCandidate[];
}

export function RulebookDetailView({ rulebook, grantCandidates }: RulebookDetailViewProps) {
  const logHref = `/log?target=${encodeURIComponent(rulebook.name)}`;
  const sub = rulebook.hidden ? "숨김 · 룰북 상세" : "룰북 상세";
  return (
    <>
      <AdminHeader
        title={rulebook.label}
        sub={sub}
        back={{ href: "/rules", label: "룰북" }}
        actions={
          <Button variant="outline" colorPalette="gray" size="sm" render={<Link href={logHref} />}>
            활동 기록에서 보기
          </Button>
        }
      />
      <RulebookEditForm key={rulebook.label} rulebook={rulebook}>
        <CertifiedGmPanel gms={rulebook.certifiedGms} certRequired={rulebook.certRequired} />
      </RulebookEditForm>
      {rulebook.certRequired ? (
        <GrantDialogSlot
          rulebookId={rulebook.id}
          rulebookLabel={rulebook.label}
          candidates={grantCandidates}
        />
      ) : null}
    </>
  );
}
