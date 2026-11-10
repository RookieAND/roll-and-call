"use client";

import { IconButton, Sheet, VStack } from "@roll-and-call/ui";
import { EllipsisVertical } from "lucide-react";

import { ReopenGameLink } from "@/features/reopen-game";
import { ServerLink } from "@/shared/ui";

import { SESSION_ACTION_KIND, type SessionCardModel } from "../model/session-card-model";
import { SessionCardAction } from "./session-card-action";

export function SessionCardMenu({ model }: { model: SessionCardModel }) {
  const primary = model.content?.primaryAction;
  const secondary = model.action && model.action.href !== primary?.href ? model.action : null;
  if (!secondary && !model.canReopen) return null;
  return (
    <Sheet.Root>
      <Sheet.Trigger
        render={
          <IconButton
            variant="ghost"
            aria-label={`${model.title} 더보기`}
            className="-mt-075 -mr-075 shrink-0"
          />
        }
      >
        <EllipsisVertical size={18} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup aria-label={`${model.title} 메뉴`}>
        <Sheet.Handle />
        <Sheet.Title className="px-200 pt-150 text-heading3">{model.title}</Sheet.Title>
        <Sheet.Body>
          <VStack gap="100">
            {secondary &&
              (secondary.kind === SESSION_ACTION_KIND.cancelWaitlist ? (
                <SessionCardAction model={model} />
              ) : (
                <Sheet.Item render={<ServerLink path={secondary.href} />}>
                  {secondary.label}
                </Sheet.Item>
              ))}
            {model.canReopen && (
              <ReopenGameLink gameId={model.id} variant="outline" colorPalette="gray" size="md" />
            )}
          </VStack>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
