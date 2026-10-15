"use client";

import { Button, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import {
  CERT_GRANT_METHOD,
  CERT_MANAGE_STATUS,
  CERT_MANAGE_STATUS_LABEL,
  type CertManageRow,
} from "@/entities/cert";
import { formatDate } from "@/shared/lib";
import { ServerLink, Tag } from "@/shared/ui";

import { CERT_ROW_ACTION, type CertRowActionLink } from "../../model/cert-row-action";

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

interface CertManageMobileRowProps {
  row: CertManageRow;
  actions: CertRowActionLink[];
}

// 목록 줄에는 조치 버튼을 두지 않는다. 줄을 누르면 데스크톱 ⋯ 메뉴와 같은 조치가 시트로 열린다.
export function CertManageMobileRow({ row, actions }: CertManageMobileRowProps) {
  const status = CERT_MANAGE_STATUS_LABEL[row.status];
  const certified = row.status === CERT_MANAGE_STATUS.certified;
  const [open, setOpen] = useState(false);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      {/* ponytail: 목록 한 줄 전체가 누르는 자리라 버튼 룩이 없다(ListRow와 같은 규격). */}
      <Sheet.Trigger
        render={<button type="button" />}
        className="flex w-full flex-col gap-050 border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175 text-left active:bg-gray-50"
      >
        <HStack align="center" gap="075" className="min-h-6 w-full min-w-0">
          <Text typography="body2" weight="bold" truncate className="min-w-0 shrink">
            {row.rulebook}
          </Text>
          <HStack gap="050" className="shrink-0">
            {row.sanctioned ? <Tag tone="danger">제재 중</Tag> : null}
            {row.editionEligible === false ? <Tag>일부 인증</Tag> : null}
          </HStack>
          <HStack className="ml-auto shrink-0">
            <Tag tone={status.tone}>{status.label}</Tag>
          </HStack>
        </HStack>
        <Text typography="body3" foreground="muted" truncate className="w-full leading-5">
          {`${row.nickname} · ${row.edition}`}
        </Text>
        <Text typography="body4" foreground="hint" truncate className="w-full leading-[18px]">
          {`${METHOD_LABEL[row.method]} · ${formatDate(row.changedAt)}`}
        </Text>
      </Sheet.Trigger>
      <Sheet.Popup className="px-200 pt-100">
        <Sheet.Handle />
        <Sheet.Title className="text-heading3">{`${row.nickname} · ${row.rulebook}`}</Sheet.Title>
        <VStack gap="075">
          {actions.map(({ action, href }) => (
            <Button
              key={action}
              variant="outline"
              colorPalette={action === CERT_ROW_ACTION.revoke ? "danger" : "gray"}
              className="min-h-12 w-full"
              render={<ServerLink path={href} scroll={false} />}
              onClick={() => setOpen(false)}
            >
              {ACTION_LABEL[action]}
            </Button>
          ))}
          {certified && row.method === CERT_GRANT_METHOD.staff ? (
            <Text typography="body4" foreground="hint">
              운영진이 직접 부여한 인증에는 「인증 사진 보기」가 없습니다.
            </Text>
          ) : null}
        </VStack>
        <Sheet.Footer>
          <Sheet.Close
            render={<Button variant="outline" colorPalette="gray" className="min-h-12 w-full" />}
          >
            닫기
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
