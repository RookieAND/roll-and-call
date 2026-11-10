import { Badge, Button, Text, VStack } from "@roll-and-call/ui";
import { Book, Layers } from "lucide-react";

import {
  CERT_STATE,
  certRowMeta,
  RULEBOOK_KIND,
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
  const rejected = rulebook.state === CERT_STATE.rejected;
  const pendingMeta =
    rulebook.state === CERT_STATE.pending && rulebook.stateAt
      ? `${toKst(rulebook.stateAt).format("MM.DD")} 신청 · 확인하고 있습니다`
      : certRowMeta(rulebook);
  const meta = certified ? undefined : pendingMeta;
  const KindIcon = rulebook.kind === RULEBOOK_KIND.supplement ? Layers : Book;

  return (
    <Button
      render={<ServerLink path={`/me/rulebooks/${rulebook.id}`} />}
      variant="ghost"
      colorPalette="gray"
      className="h-auto min-h-12 w-full justify-start gap-125 rounded-none px-175 py-100 text-left not-first:border-t not-first:border-gray-200"
    >
      <span
        aria-hidden
        className="box-border inline-flex size-[34px] flex-none items-center justify-center rounded-300 bg-primary-50 p-075 text-primary-600"
      >
        <KindIcon size={20} strokeWidth={2} />
      </span>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="subtitle1" render={<span />}>
          {rulebook.label}
        </Text>
        {meta && (
          <Text typography="body4" foreground={rejected ? "warning" : "hint"} render={<span />}>
            {meta}
          </Text>
        )}
      </VStack>
      {certified && <Badge colorPalette="gray">{RULEBOOK_KIND_GROUP[rulebook.kind]}</Badge>}
      {!certified && rulebook.state && (
        <Badge colorPalette={rejected ? "warning" : "gray"}>
          {MY_PAGE_CERT_LABEL[rulebook.state]}
        </Badge>
      )}
    </Button>
  );
}
