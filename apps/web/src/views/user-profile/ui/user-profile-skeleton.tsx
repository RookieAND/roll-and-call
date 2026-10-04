import { Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function UserProfileSkeleton() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <div className="px-200 pt-250 pb-050">
          <HStack align="center" gap="175">
            <Skeleton width={64} height={64} rounded="full" />
            <div className="min-w-0 flex-1">
              <Skeleton width={128} height={27} />
              <Skeleton width={112} height={20} className="mt-050" />
            </div>
          </HStack>
          <Skeleton width="75%" height={24} className="mt-175" />
          <div className="mt-175">
            <Grid cols={2} className="-mx-200 border-y border-gray-200">
              {range(2).map((index) => (
                <VStack
                  key={index}
                  align="center"
                  gap="050"
                  className="border-gray-200 py-175 not-first:border-l"
                >
                  <Skeleton width={24} height={27} />
                  <Skeleton width={64} height={17} />
                </VStack>
              ))}
            </Grid>
          </div>
          <div className="mt-175">
            <Skeleton width={40} height={17} className="mb-100" />
            <HStack gap="075">
              <Skeleton width={80} height={32} rounded="full" />
              <Skeleton width={64} height={32} rounded="full" />
            </HStack>
          </div>
        </div>

        <section className="p-200">
          <Skeleton width={40} height={17} className="mb-100" />
          <HStack gap="100">
            {range(3).map((index) => (
              <Skeleton key={index} width={44} height={44} rounded={500} />
            ))}
          </HStack>
        </section>

        <section className="px-200 pb-200">
          <Skeleton width={80} height={17} className="mb-100" />
          <Skeleton width="100%" height={52} rounded={500} />
        </section>
      </Container>
    </>
  );
}
