import { Button, Callout, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import type { UserDetail } from "@/shared/server";

import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import type { UserDetailTab } from "../model/user-detail-tab";
import { OtherActionsMenu } from "./other-actions-menu";

interface UserActionsAsideProps {
  user: UserDetail;
  tab: UserDetailTab;
}

export function UserActionsAside({ user, tab }: UserActionsAsideProps) {
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[288px] shrink-0 border-l border-gray-200 bg-surface"
    >
      <Text
        typography="subtitle2"
        foreground="muted"
        render={<h2 />}
        className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        조치
      </Text>
      <VStack gap="100" className="p-150">
        {user.sanction ? (
          <Button
            className="w-full"
            render={
              <Link
                href={userActionHref(user.id, { tab, action: USER_ACTION.release })}
                scroll={false}
              />
            }
          >
            제재 해제
          </Button>
        ) : (
          <Button
            variant="outline"
            colorPalette="danger"
            className="w-full"
            render={
              <Link
                href={userActionHref(user.id, { tab, action: USER_ACTION.sanction })}
                scroll={false}
              />
            }
          >
            제재
          </Button>
        )}
        <OtherActionsMenu user={user} />
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon />
          <Callout.Description>
            제재와 인증 취소에는 사용자에게 보여줄 사유가 필요합니다.
          </Callout.Description>
        </Callout.Root>
      </VStack>
    </VStack>
  );
}
