import { Badge, Button, Callout, Table, Text, VStack } from "@roll-and-call/ui";
import { Ban } from "lucide-react";
import Link from "next/link";

import { formatDate, formatMonthDay } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { Panel } from "@/shared/ui";

import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import { USER_DETAIL_TAB } from "../model/user-detail-tab";

interface CertPanelProps {
  user: UserDetail;
}

export function CertPanel({ user }: CertPanelProps) {
  const pending = user.applications.filter((application) => application.status === "pending");
  const rejected = user.applications.filter((application) => application.status === "rejected");
  return (
    <VStack gap="150">
      {user.sanction ? (
        <Callout.Root colorPalette="gray">
          <Callout.Icon>
            <Ban size={14} strokeWidth={2.2} />
          </Callout.Icon>
          <Callout.Description>
            제재 기간에는 인증된 룰북이 있어도 구인을 개설할 수 없습니다.
          </Callout.Description>
        </Callout.Root>
      ) : null}
      <Panel
        title="룰북 인증"
        right={
          <Text typography="body4" foreground="hint">
            구인 개설 가능 {user.certifications.length}개 · 심사 대기 {pending.length}개
          </Text>
        }
      >
        <Table.Root className="table-fixed">
          <colgroup>
            <col />
            <col className="w-[96px]" />
            <col className="w-[170px]" />
            <col className="w-[120px]" />
            <col className="w-[104px]" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.Head>룰북</Table.Head>
              <Table.Head>상태</Table.Head>
              <Table.Head>일자</Table.Head>
              <Table.Head>처리한 운영진</Table.Head>
              <Table.Head aria-label="조치" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {user.certifications.map((certification) => (
              <Table.Row key={certification.rulebook}>
                <Table.Cell>
                  <Text typography="body3" weight="bold" truncate>
                    {certification.rulebook}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="success">인증됨</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground="hint">
                    {formatDate(certification.approvedAt)} 승인
                  </Text>
                </Table.Cell>
                <Table.Cell>{certification.approvedBy}</Table.Cell>
                <Table.Cell>
                  <Button
                    variant="ghost"
                    colorPalette="danger"
                    size="sm"
                    render={
                      <Link
                        href={userActionHref(user.id, {
                          tab: USER_DETAIL_TAB.cert,
                          action: USER_ACTION.revoke,
                          rulebook: certification.rulebook,
                        })}
                        scroll={false}
                      />
                    }
                  >
                    인증 취소
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {pending.map((application) => (
              <Table.Row key={application.id}>
                <Table.Cell>
                  <Text typography="body3" weight="bold" truncate>
                    {application.rulebook}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="warning">심사 대기</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground="hint">
                    {formatMonthDay(application.appliedAt)} 신청
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground="hint">
                    -
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="outline"
                    colorPalette="gray"
                    size="sm"
                    render={<Link href={`/cert/${application.id}`} />}
                  >
                    심사 열기
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
            {rejected.map((application) => (
              <Table.Row key={application.id} className="opacity-50">
                <Table.Cell>
                  <Text typography="body3" weight="bold" truncate>
                    {application.rulebook}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="danger">반려</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground="hint">
                    {application.processedAt
                      ? `${formatMonthDay(application.processedAt)} 반려`
                      : "반려"}
                  </Text>
                </Table.Cell>
                <Table.Cell>{application.processedBy}</Table.Cell>
                <Table.Cell />
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Panel>
    </VStack>
  );
}
