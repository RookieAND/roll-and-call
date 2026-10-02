"use client";

import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PostDetail } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { ACTION_COPY } from "../model/action-copy";
import { POST_ACTION, type PostAction } from "../model/post-action";
import { PostActionForm } from "./post-action-form";
import { PostRemoveForm } from "./post-remove-form";

const REMOVE_WIDTH_CLASS_NAME = "max-w-[600px]";

interface PostActionDialogProps {
  post: PostDetail;
  action: PostAction | null;
  closeHref: string;
}

// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다.
export function PostActionDialog({ post, action, closeHref }: PostActionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [shownAction, setShownAction] = useState(action);
  if (action && action !== shownAction) setShownAction(action);
  const close = () => router.replace(toServerPath(closeHref), { scroll: false });
  const removing = shownAction === POST_ACTION.remove;
  const widthClassName =
    shownAction && shownAction !== POST_ACTION.remove
      ? ACTION_COPY[shownAction].widthClassName
      : REMOVE_WIDTH_CLASS_NAME;
  return (
    <Dialog.Root open={!isNull(action)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className={widthClassName}>
        {removing ? <PostRemoveForm key={shownAction} post={post} /> : null}
        {shownAction && shownAction !== POST_ACTION.remove ? (
          <PostActionForm key={shownAction} post={post} action={shownAction} onDone={close} />
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
