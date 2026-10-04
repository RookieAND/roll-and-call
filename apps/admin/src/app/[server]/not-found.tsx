import { Button } from "@roll-and-call/ui";

import { AdminHeader, EMPTY_IMAGE, EmptyState, ServerLink } from "@/shared/ui";

export default function ServerNotFound() {
  return (
    <>
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
    </>
  );
}
