import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { RulebookEditForm } from "@/features/write-rulebook";
import type { GrantCandidate, RulebookDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import { CategoryCard } from "./category-card";
import { CertifiedGmPanel } from "./certified-gm-panel";
import { GrantDialogSlot } from "./grant-dialog-slot";

interface RulebookDetailViewProps {
  rulebook: RulebookDetail;
  grantCandidates: GrantCandidate[];
  page?: string;
}

export function RulebookDetailView({ rulebook, grantCandidates, page }: RulebookDetailViewProps) {
  const logHref = `/log?target=${encodeURIComponent(rulebook.name)}`;
  const sub = `${rulebook.hidden ? "숨김 · " : ""}룰북 상세 · ${rulebook.category}`;
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
      <RulebookEditForm
        key={rulebook.label}
        rulebook={rulebook}
        aside={<CategoryCard rulebook={rulebook} />}
      >
        <CertifiedGmPanel
          gms={rulebook.certifiedGms}
          certRequired={rulebook.certRequired}
          page={page}
        />
      </RulebookEditForm>
      {rulebook.certRequired ? (
        <GrantDialogSlot
          rulebookId={rulebook.id}
          rulebookLabel={rulebook.label}
          categoryEdition={`${rulebook.category} ${rulebook.edition}`.trim()}
          candidates={grantCandidates}
        />
      ) : null}
    </>
  );
}
