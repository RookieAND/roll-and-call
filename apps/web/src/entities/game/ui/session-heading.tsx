import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

interface SessionHeadingProps {
  title: string;
  rule: string;
  subline: string;
}

// 세션 하나를 다루는 화면(후기 쓰기·세션 후기) 맨 위의 제목 · 룰 배지 · 일시 한 줄.
export function SessionHeading({ title, rule, subline }: SessionHeadingProps) {
  return (
    <VStack gap="050">
      <HStack align="center" gap="075">
        <Text
          typography="heading3"
          weight="extrabold"
          render={<h2 />}
          className="min-w-0 flex-1 truncate"
        >
          {title}
        </Text>
        <Badge>{rule}</Badge>
      </HStack>
      <Text typography="body4" foreground="hint" numeric>
        {subline}
      </Text>
    </VStack>
  );
}
