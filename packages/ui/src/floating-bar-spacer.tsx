"use client";

import { useContext } from "react";

import { FloatingBarContext } from "./floating-bar-context";

// 본문 끝에 두면 바의 실제 높이만큼 자리를 비워 마지막 줄이 가려지지 않는다.
export function FloatingBarSpacer() {
  const { height } = useContext(FloatingBarContext);
  return <div aria-hidden data-slot="floating-bar-spacer" style={{ height }} />;
}
