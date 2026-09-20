import { Badge, Container, Skeleton } from "@trpg/ui";

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
          <div className="flex items-start gap-125">
            <Skeleton className="h-7 min-w-0 flex-1" />
            <Skeleton className="h-[21px] w-14 shrink-0 rounded-300" />
          </div>
          <Skeleton className="mt-100 h-5 w-56" />
        </div>

        <div className="p-200">
          <div className="overflow-hidden rounded-500 border border-gray-200">
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[60px] items-center gap-150 border-gray-100 px-175 py-150 not-first:border-t"
              >
                <Skeleton className="h-[34px] w-[34px] flex-none rounded-400" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-[21px] w-24" />
                  <Skeleton className="mt-025 h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-4 flex-none rounded-100" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
