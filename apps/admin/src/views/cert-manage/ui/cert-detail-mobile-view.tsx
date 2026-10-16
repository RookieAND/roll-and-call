import { Button } from "@roll-and-call/ui";
import { VStack } from "@roll-and-call/ui";

import { CERT_GRANT_METHOD, CERT_MANAGE_STATUS_LABEL, type CertManageRow } from "@/entities/cert";
import type { RevokeTarget } from "@/entities/cert/server";
import { formatDate } from "@/shared/lib";
import {
  AdminHeader,
  KeyValueList,
  MobileDetailBar,
  MobileSection,
  MobileTitle,
  ServerLink,
  Tag,
} from "@/shared/ui";

import { CERT_ROW_ACTION } from "../model/cert-row-action";
import { certRowActions } from "../model/cert-row-actions";
import { RevokeDialogSlot } from "./revoke-dialog-slot";

const METHOD_LABEL = {
  [CERT_GRANT_METHOD.photo]: "사진 심사",
  [CERT_GRANT_METHOD.staff]: "운영진 부여",
} as const;

const ACTION_LABEL = {
  [CERT_ROW_ACTION.revoke]: "반려로 돌리기",
  [CERT_ROW_ACTION.review]: "심사 상세 열기",
  [CERT_ROW_ACTION.proof]: "인증 사진 보기",
  [CERT_ROW_ACTION.log]: "활동 기록에서 보기",
} as const;

interface CertDetailMobileViewProps {
  row: CertManageRow;
  revokeTarget: RevokeTarget | null;
  staffChannel: boolean;
}

// 아래 고정 바는 가장 자주 쓰는 [활동 기록에서 보기]와 [⋯]. 반려로 돌리기는 [⋯] 시트 맨 아래 빨간 outline이다.
export function CertDetailMobileView({
  row,
  revokeTarget,
  staffChannel,
}: CertDetailMobileViewProps) {
  const status = CERT_MANAGE_STATUS_LABEL[row.status];
  const actions = certRowActions({ row, query: {} });
  const log = actions.find(({ action }) => action === CERT_ROW_ACTION.log);
  const detailPath = `/cert/manage/${encodeURIComponent(row.key)}`;
  // 반려로 돌리기 시트는 이 화면 위에서 열린다(?action=revoke).
  const others = actions
    .filter(({ action }) => action !== CERT_ROW_ACTION.log)
    .map((item) =>
      item.action === CERT_ROW_ACTION.revoke
        ? { ...item, href: `${detailPath}?action=${CERT_ROW_ACTION.revoke}` }
        : item,
    );
  return (
    <>
      <AdminHeader
        title={<MobileTitle title="인증 상세" sub={row.nickname} />}
        trail={[{ href: "/cert/manage", label: "인증 관리" }]}
      />
      <VStack className="px-150 pt-150 pb-200">
        <MobileSection flush>
          <KeyValueList
            items={[
              { label: "닉네임", value: row.nickname },
              { label: "룰북", value: row.rulebook },
              { label: "판본", value: row.edition },
              { label: "인증 방식", value: METHOD_LABEL[row.method] },
              { label: "상태", value: <Tag tone={status.tone}>{status.label}</Tag> },
              { label: "처리 일자", value: formatDate(row.changedAt) },
            ]}
          />
        </MobileSection>
      </VStack>
      {revokeTarget ? <RevokeDialogSlot target={revokeTarget} staffChannel={staffChannel} /> : null}
      <MobileDetailBar
        primary={
          <Button
            variant="outline"
            colorPalette="gray"
            render={<ServerLink path={log?.href ?? "/audit"} />}
          >
            {ACTION_LABEL[CERT_ROW_ACTION.log]}
          </Button>
        }
        more={
          others.length > 0
            ? {
                title: "인증 처리",
                items: others.map(({ action, href }) => (
                  <Button
                    key={action}
                    variant="outline"
                    colorPalette={action === CERT_ROW_ACTION.revoke ? "danger" : "gray"}
                    render={<ServerLink path={href} scroll={false} />}
                  >
                    {ACTION_LABEL[action]}
                  </Button>
                )),
              }
            : undefined
        }
      />
    </>
  );
}
