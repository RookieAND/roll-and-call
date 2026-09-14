import { Container, Text, VStack } from "@trpg/ui";

export const Sizes = () => (
  <VStack gap={2}>
    {(["sm", "md", "lg"] as const).map((size) => (
      <Container key={size} size={size} className="rounded-lg border border-dashed border-gray-300 py-3">
        <Text typography="body3" foreground="muted">
          Container size="{size}" · mx-auto + px-4
        </Text>
      </Container>
    ))}
  </VStack>
);
