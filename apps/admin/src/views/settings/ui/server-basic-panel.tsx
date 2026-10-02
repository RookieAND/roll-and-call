import { HStack, Text } from "@roll-and-call/ui";

import { FactRows, Panel, ServerIcon } from "@/shared/ui";

interface ServerBasicPanelProps {
  name: string;
  slug: string;
  icon: string | null;
}

export function ServerBasicPanel({ name, slug, icon }: ServerBasicPanelProps) {
  return (
    <Panel title="서버 기본 정보" bodyClassName="p-175">
      <HStack align="center" gap="150">
        <ServerIcon name={name} icon={icon} size={48} />
        <div className="flex-1">
          <FactRows
            labelWidth={72}
            items={[
              { label: "표시 이름", value: name },
              { label: "slug", value: `/${slug}` },
            ]}
          />
        </div>
      </HStack>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-125">
        아이콘과 표시 이름은 디스코드 서버에서 가져옵니다. slug를 바꾸려면 개발자에게 문의해 주세요.
      </Text>
    </Panel>
  );
}
