import { Badge, Card, Container, HStack, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// manageRows 3행 + DeleteGameRow 1행.
const ROW_COUNT = 4;

export default function Loading() {
  return (
    <>
      <AppBar
        back="/games"
        title="운영 관리"
        action={
          <Badge color="primary" className="mr-100">
            GM
          </Badge>
        }
      />
      <Container size="sm" className="px-0">
        <div className="border-b border-gray-100 px-200 pt-225 pb-175">
          <HStack align="start" gap="125">
            <Skeleton height={28} className="min-w-0 flex-1" />
            <Skeleton width={56} height={21} rounded={300} className="shrink-0" />
          </HStack>
          <Skeleton width={224} height={20} className="mt-100" />
        </div>

        <div className="p-200">
          <Card radius={500} background="none" padding="none" className="overflow-hidden">
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <HStack
                key={index}
                align="center"
                gap="150"
                className="min-h-[60px] border-gray-100 px-175 py-150 not-first:border-t"
              >
                <Skeleton width={34} height={34} rounded={400} className="flex-none" />
                <div className="min-w-0 flex-1">
                  <Skeleton width={96} height={21} />
                  <Skeleton width={160} height={20} className="mt-025" />
                </div>
                <Skeleton width={16} height={16} rounded={100} className="flex-none" />
              </HStack>
            ))}
          </Card>
        </div>
      </Container>
    </>
  );
}
