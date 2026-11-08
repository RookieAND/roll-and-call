import { Button, Card, Text, UiImage, VStack, type UiAssetName } from "@roll-and-call/ui";

interface UserSessionsEmptyCardProps {
  image: UiAssetName;
  title: string;
  description?: string;
  retry?: () => void;
  retryLabel?: string;
}

export function UserSessionsEmptyCard({
  image,
  title,
  description,
  retry,
  retryLabel,
}: UserSessionsEmptyCardProps) {
  return (
    <Card.Root padding="none" background="none">
      <VStack gap="150" className="items-center text-center">
        <UiImage name={image} width={104} height={104} />
        <VStack gap="050" className="items-center">
          <Text typography="subtitle1">{title}</Text>
          {description && (
            <Text typography="body3" foreground="muted">
              {description}
            </Text>
          )}
          {retry && (
            <div className="pt-100">
              <Button variant="outline" size="sm" onClick={retry}>
                {retryLabel}
              </Button>
            </div>
          )}
        </VStack>
      </VStack>
    </Card.Root>
  );
}
