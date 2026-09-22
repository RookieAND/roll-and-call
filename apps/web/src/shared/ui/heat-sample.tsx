import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

const STEPS = [0, 1, 0, 2, 1, 1, 2, 1, 4, 2, 2, 4, 2, 5, 3, 0, 1, 0, 2, 1];

// 온보딩과 도움말이 같은 격자 그림을 쓴다. 실제 조율 화면이 아니라 설명용 축소판이다.
export function HeatSample() {
  return (
    <VStack gap="125">
      <Grid cols={5} gap="050">
        {STEPS.map((step, index) => (
          <span
            key={index}
            className="h-6 rounded-200 border border-gray-100"
            style={{ backgroundColor: `var(--color-heat-${step})` }}
          />
        ))}
      </Grid>
      <HStack align="center" gap="100">
        <Text typography="body4" foreground="muted" render={<span />}>
          적음
        </Text>
        <span
          className="h-[7px] flex-1 rounded-100"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-heat-1), var(--color-heat-3), var(--color-heat-5))",
          }}
        />
        <Text typography="body4" foreground="muted" render={<span />}>
          모두 가능
        </Text>
      </HStack>
    </VStack>
  );
}
