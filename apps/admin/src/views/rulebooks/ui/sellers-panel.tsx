import { Badge, Table, Text } from "@roll-and-call/ui";

import { AddSellerButton, RemoveSellerButton } from "@/features/manage-cert-sellers";
import type { CertSellerRow } from "@/shared/server";
import { Panel, TableColumns } from "@/shared/ui";

interface SellersPanelProps {
  sellers: CertSellerRow[];
}

// 전자책 인증에서 고르는 판매처. 목록에 없는 판매처는 신청자가 「기타」를 고른 뒤 직접 적는다.
export function SellersPanel({ sellers }: SellersPanelProps) {
  return (
    <>
      <Panel
        title="전자책 판매처"
        right={
          <>
            <Badge>{sellers.length}곳</Badge>
            <AddSellerButton />
          </>
        }
      >
        <Table.Root className="table-equal">
          <TableColumns widths={[200, 160, { fixed: 132 }]} />
          <Table.Header>
            <Table.Row>
              <Table.Head>판매처</Table.Head>
              <Table.Head align="end">이 판매처로 인증된 책</Table.Head>
              <Table.Head />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sellers.map((seller) => (
              <Table.Row key={seller.id}>
                <Table.Cell>
                  <Text typography="body3" weight="bold" truncate>
                    {seller.name}
                  </Text>
                </Table.Cell>
                <Table.Cell align="end" numeric>
                  <Text typography="body3" foreground={seller.certifiedCount ? "normal" : "hint"}>
                    {seller.certifiedCount}권
                  </Text>
                </Table.Cell>
                <Table.Cell align="end">
                  <RemoveSellerButton id={seller.id} name={seller.name} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Panel>
      <Text typography="body4" foreground="hint">
        목록에 없는 판매처는 신청자가 「기타」를 고른 뒤 직접 입력합니다.
      </Text>
    </>
  );
}
