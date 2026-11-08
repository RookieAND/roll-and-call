import {
  CERT_STATE,
  CertStateRow,
  certRowMeta,
  RULEBOOK_KIND_GROUP,
  type MyRulebook,
} from "@/entities/rulebook";
import { toKst } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { MY_PAGE_CERT_LABEL } from "../model/my-page-cert-label";

interface MyPageRulebookRowProps {
  rulebook: MyRulebook;
}

export function MyPageRulebookRow({ rulebook }: MyPageRulebookRowProps) {
  const certified = rulebook.state === CERT_STATE.certified;
  const pendingMeta =
    rulebook.state === CERT_STATE.pending && rulebook.stateAt
      ? `${toKst(rulebook.stateAt).format("MM.DD")} 신청 · 확인하고 있습니다`
      : certRowMeta(rulebook);
  const meta = certified ? undefined : pendingMeta;
  return (
    <ServerLink
      path={`/me/rulebooks/${rulebook.id}`}
      className="block border-t border-gray-200 transition-colors hover:bg-gray-50"
    >
      <CertStateRow
        state={rulebook.state!}
        title={rulebook.label}
        meta={meta}
        statusPlacement={certified ? "none" : "badge"}
        statusLabel={MY_PAGE_CERT_LABEL[rulebook.state!]}
        kindLabel={certified ? RULEBOOK_KIND_GROUP[rulebook.kind] : undefined}
        size="sm"
      />
    </ServerLink>
  );
}
