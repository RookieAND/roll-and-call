"use client";

import { Button } from "@roll-and-call/ui";

import { AdminHeader, EMPTY_IMAGE, EmptyState } from "@/shared/ui";

export default function ServerError({ retry }: { retry: () => void }) {
  return (
    <>
      <AdminHeader title="" />
      <EmptyState
        size="full"
        image={EMPTY_IMAGE.error}
        title="화면을 불러오지 못했습니다"
        description={
          <>
            잠시 후 다시 시도해 주세요.
            <br />
            문제가 계속되면 서버 소유자에게 알려 주세요.
          </>
        }
        action={
          <Button variant="outline" onClick={retry}>
            다시 시도
          </Button>
        }
        className="flex-1"
      />
    </>
  );
}
