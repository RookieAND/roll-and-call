import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 메모 삭제 줄은 이미 쓴 메모가 있을 때만 붙어서 뼈대에서 뺀다.
export default function Loading() {
  return (
    <Container size="sm" className="px-0">
      <AppBar back="/games" title="메모" action={<Skeleton className="mr-2 h-9 w-12" />} />

      <div className="flex items-center gap-[11px] border-b border-gray-100 px-4 py-3.5">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-[21px] w-24" />
          <Skeleton className="mt-0.5 h-[17px] w-20" />
        </div>
      </div>

      <div className="p-4">
        <Skeleton className="h-[150px] w-full rounded-[10px]" />
        <div className="mt-[7px] flex items-baseline gap-2">
          <Skeleton className="h-[17px] flex-1" />
          <Skeleton className="h-[17px] w-16 flex-none" />
        </div>
      </div>
    </Container>
  );
}
