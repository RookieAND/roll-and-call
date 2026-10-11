import { Container, FloatingBar, Grid, Progress, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function RulebookPhotosSkeleton() {
  return (
    <>
      <AppBar
        back="/me/rulebooks/apply"
        title="인증 신청"
        action={
          <Text typography="body4" foreground="hint" numeric className="px-100">
            2 / 2
          </Text>
        }
      />
      <Progress value={2} max={2} className="h-[3px] rounded-none" aria-label="진행" />
      <Container size="sm">
        <VStack gap="200" aria-busy className="pt-200 pb-250">
          <VStack gap="050">
            <Skeleton width={160} height={26} />
            <Skeleton width={120} height={17} />
          </VStack>
          <Skeleton width="100%" height={64} rounded={300} />
          <Skeleton width="100%" height={72} rounded={300} />
          <Grid cols={2} gap="100">
            <Skeleton width="100%" height={220} rounded={500} />
            <Skeleton width="100%" height={220} rounded={500} />
          </Grid>
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Skeleton width="100%" height={48} rounded={500} />
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
