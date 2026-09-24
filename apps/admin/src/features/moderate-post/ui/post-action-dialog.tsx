"use client";

import { Dialog } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PostDetail } from "@/shared/server";

import type { PostAction } from "../model/post-action";
import { PostActionForm } from "./post-action-form";

interface PostActionDialogProps {
  post: PostDetail;
  action: PostAction | null;
  closeHref: string;
}

// 주소의 action으로 연다. 지금 상태에서 할 수 없는 조치는 화면이 null로 넘긴다.
// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다.
export function PostActionDialog({ post, action, closeHref }: PostActionDialogProps) {
  const router = useRouter();
  const [shownAction, setShownAction] = useState(action);
  if (action && action !== shownAction) setShownAction(action);
  const close = () => router.replace(closeHref, { scroll: false });
  return (
    <Dialog.Root open={action !== null} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[600px]">
        {shownAction ? (
          <PostActionForm key={shownAction} post={post} action={shownAction} onDone={close} />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
