"use client";

import { AlertDialog, Dialog, toast } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { conflictToastText } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { ACTION_COPY } from "../model/action-copy";
import { POST_ACTION, type PostAction } from "../model/post-action";
import type { PostModerationOutcome } from "../model/post-moderation-outcome";
import { PostHideForm } from "./post-hide-form";
import { PostRemoveForm } from "./post-remove-form";
import { PostUnhideForm } from "./post-unhide-form";

const CONFLICT_TARGET = "구인";

interface PostActionDialogProps {
  post: PostDetail;
  availableActions: PostAction[];
  closeHref: string;
  viewerId: string;
}

// 닫히는 동안에도 제목이 남도록 마지막 조치를 기억한다. 구인 취소는 되돌릴 수 없어 AlertDialog로 연다.
// 충돌은 창 안에 두지 않는다. 창을 닫고 상세를 새로 읽은 뒤 토스트로만 알린다(D295, D296).
export function PostActionDialog({
  post,
  availableActions,
  closeHref,
  viewerId,
}: PostActionDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const actionParam = useSearchParams().get("action");
  const action = availableActions.find((candidate) => candidate === actionParam) ?? null;
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [shownAction, setShownAction] = useState(action);
  if (action && action !== shownAction) setShownAction(action);
  const close = () => window.history.replaceState(null, "", toServerPath(closeHref));
  const settle = (outcome: PostModerationOutcome) => {
    if (outcome.ok) {
      close();
      return;
    }
    if (outcome.gone) {
      router.push(toServerPath("/posts"));
      toast.info(conflictToastText({ conflict: null, self: false, target: CONFLICT_TARGET }));
      return;
    }
    close();
    router.refresh();
    const self = outcome.conflict?.byId === viewerId;
    toast.info(conflictToastText({ conflict: outcome.conflict, self, target: CONFLICT_TARGET }));
  };
  const removing = shownAction === POST_ACTION.remove;
  const Root = removing ? AlertDialog.Root : Dialog.Root;
  return (
    <Root open={!isNull(action)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup
        size="lg"
        initialFocus={removing ? cancelRef : undefined}
        className={shownAction ? ACTION_COPY[shownAction].widthClassName : undefined}
      >
        {shownAction === POST_ACTION.hide ? <PostHideForm post={post} onSettled={settle} /> : null}
        {shownAction === POST_ACTION.unhide ? (
          <PostUnhideForm post={post} onSettled={settle} />
        ) : null}
        {removing ? <PostRemoveForm post={post} cancelRef={cancelRef} onSettled={settle} /> : null}
      </Dialog.Popup>
    </Root>
  );
}
