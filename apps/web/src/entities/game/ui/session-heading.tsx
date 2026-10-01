import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

interface SessionHeadingProps {
  title: string;
  rule: string;
  subline: string;
}

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
