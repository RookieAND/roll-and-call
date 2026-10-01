import { Text, VStack } from "@roll-and-call/ui";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <VStack gap="100">
      <Text typography="code2" weight="bold" foreground="primary" className="tracking-[0.12em]">
        {eyebrow}
      </Text>
      <Text
        typography="heading1"
        render={<h2 />}
        className="text-[length:clamp(24px,2.8cqw,34px)] leading-[1.3]"
      >
        {title}
      </Text>
      {description && (
        <Text typography="body2" foreground="muted" className="[text-wrap:pretty]">
          {description}
        </Text>
      )}
    </VStack>
  );
}
