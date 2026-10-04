import { HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { FactRows, Panel, ServerIcon } from "@/shared/ui";

type ServerBasicPanelProps =
  | { loading?: false; name: string; slug: string; icon: string | null }
  | { loading: true };

const VALUE_SKELETON = (
  <Skeleton width={120} height={14} render={<span />} className="inline-block" />
);

export function ServerBasicPanel(props: ServerBasicPanelProps) {
  return (
    <Panel title="서버 기본 정보" bodyClassName="p-175">
      <HStack align="center" gap="150">
        {props.loading ? (
          <Skeleton width={48} height={48} rounded={400} />
        ) : (
          <ServerIcon name={props.name} icon={props.icon} size={48} />
        )}
        <div className="flex-1">
          <FactRows
            labelWidth={72}
            items={[
              { label: "표시 이름", value: props.loading ? VALUE_SKELETON : props.name },
              { label: "slug", value: props.loading ? VALUE_SKELETON : `/${props.slug}` },
            ]}
          />
        </div>
      </HStack>
      <VStack className="mt-125">
        <Text typography="body4" foreground="hint" render={<p />}>
          아이콘과 표시 이름은 디스코드 서버에서 가져옵니다.
        </Text>
        <Text typography="body4" foreground="hint" render={<p />}>
          slug를 바꾸려면 개발자에게 문의해 주세요.
        </Text>
      </VStack>
    </Panel>
  );
}
