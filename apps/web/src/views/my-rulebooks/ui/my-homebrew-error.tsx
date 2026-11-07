"use client";

import { Button, Callout } from "@roll-and-call/ui";
import type { ErrorInfo } from "next/error";

import { MyHomebrewFrame } from "./my-homebrew-frame";

export function MyHomebrewError(_props: object, { retry }: ErrorInfo) {
  return (
    <MyHomebrewFrame>
      <Callout.Root colorPalette="danger">
        <Callout.Description className="break-keep">
          내가 만든 룰을 불러오지 못했습니다.
          <br />
          다시 시도해 주세요.
        </Callout.Description>
        <Callout.Action>
          <Button size="sm" variant="outline" onClick={() => retry()}>
            다시 시도
          </Button>
        </Callout.Action>
      </Callout.Root>
    </MyHomebrewFrame>
  );
}
