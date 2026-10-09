import { Select, Table, Text } from "@roll-and-call/ui";

import { Panel, TableColumns, Tag } from "@/shared/ui";

import { describeStatus } from "../model/describe-forum-tag-status";
import { ForumTagChip } from "./forum-tag-chip";

const NONE = "none";

interface ForumTagRow {
  key: string;
  label: string;
  value: string;
  savedValue: string;
}

interface ForumTagSectionProps {
  title: string;
  columnLabel: string;
  optional?: boolean;
  rows: ForumTagRow[];
  tags: { id: string; name: string; emoji: string | null }[];
  onChange: (key: string, tagId: string) => void;
}

export function ForumTagSection({
  title,
  columnLabel,
  optional = false,
  rows,
  tags,
  onChange,
}: ForumTagSectionProps) {
  const items = [
    { label: "연결 안 함", value: NONE },
    ...tags.map((tag) => ({ label: tag.name, value: tag.id })),
  ];
  const linked = rows.filter((row) => row.value).length;
  return (
    <Panel
      title={title}
      right={
        <Text typography="body4" foreground="hint">
          {linked} / {rows.length} 연결
        </Text>
      }
      bodyClassName="p-0"
    >
      <Table.Root className="table-equal">
        <TableColumns widths={[200, { fixed: 192 }, { fixed: 96 }, { fixed: 204 }]} />
        <Table.Header>
          <Table.Row>
            <Table.Head>{columnLabel}</Table.Head>
            <Table.Head>연결된 태그</Table.Head>
            <Table.Head>상태</Table.Head>
            <Table.Head>태그 바꾸기</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => {
            const tag = tags.find((candidate) => candidate.id === row.value);
            const deleted = Boolean(row.value) && !tag;
            const status = describeStatus({ row, deleted, optional });
            return (
              <Table.Row key={row.key}>
                <Table.Cell>
                  <Text typography="body3" truncate>
                    {row.label}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {deleted ? (
                    <span className="inline-flex items-center rounded-200 border border-dashed border-gray-500 px-100 text-body4 leading-4.5 text-muted">
                      삭제된 태그
                    </span>
                  ) : null}
                  {tag ? <ForumTagChip tag={tag} /> : null}
                </Table.Cell>
                <Table.Cell>
                  <Tag tone={status.tone}>{status.label}</Tag>
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    items={items}
                    value={deleted ? "" : row.value || NONE}
                    onValueChange={(next) => onChange(row.key, next === NONE ? "" : next)}
                  >
                    <Select.Trigger
                      aria-label={`${row.label} 태그`}
                      placeholder="태그를 다시 고르세요"
                      className="h-(--rc-size-control-xs) w-47"
                    />
                    <Select.Popup>
                      {items.map((item) => (
                        <Select.Item key={item.value} value={item.value}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Popup>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
