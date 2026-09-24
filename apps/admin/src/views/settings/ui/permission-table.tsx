import { Table } from "@roll-and-call/ui";

import { PERMISSION_ROWS } from "../model/permission-rows";
import { PermissionMark } from "./permission-mark";

export function PermissionTable() {
  return (
    <Table.Root className="table-fixed">
      <colgroup>
        <col />
        <col className="w-[100px]" />
        <col className="w-[100px]" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.Head>
            <span className="sr-only">권한</span>
          </Table.Head>
          <Table.Head align="center">소유자</Table.Head>
          <Table.Head align="center">운영진</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {PERMISSION_ROWS.map((row) => (
          <Table.Row key={row.label}>
            <Table.Cell>{row.label}</Table.Cell>
            <Table.Cell align="center">
              <PermissionMark allowed={row.owner} />
            </Table.Cell>
            <Table.Cell align="center">
              <PermissionMark allowed={row.staff} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
