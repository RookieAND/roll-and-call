import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { EMPTY_IMAGE, EmptyState } from "@/shared/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas">
      <EmptyState
        size="full"
        image={EMPTY_IMAGE.search}
        title="찾는 화면이 없습니다"
        description="주소가 바뀌었거나 삭제된 항목입니다."
        action={
          <Button variant="outline" render={<Link href="/" />}>
            서버 선택으로
          </Button>
        }
      />
    </main>
  );
}
