import { Button } from "@roll-and-call/ui";

import { AdminHeader, EMPTY_IMAGE, EmptyState, ServerLink } from "@/shared/ui";

export default function ServerNotFound() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <AdminHeader title="" />
        <EmptyState
          size="full"
          image={EMPTY_IMAGE.search}
          title="찾는 화면이 없습니다"
          description="주소가 바뀌었거나 삭제된 항목입니다."
          action={
            <Button variant="outline" render={<ServerLink path="/" />}>
              홈으로
            </Button>
          }
          className="flex-1"
        />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <AdminHeader title="" />
        <EmptyState
          image={EMPTY_IMAGE.search}
          title="찾는 화면이 없습니다"
          description="주소가 바뀌었거나 삭제된 항목입니다."
          className="flex-1 break-keep"
        />
        <div className="px-150 pt-150 pb-[calc(var(--rc-size-space-250)+var(--rc-safe-bottom))]">
          <Button render={<ServerLink path="/" />} className="h-12 w-full">
            홈으로
          </Button>
        </div>
      </div>
    </>
  );
}
