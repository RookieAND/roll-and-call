"use client";

import { useEffect } from "react";

import { overlayStore } from "./overlay-store";

// 오버레이 팝업 안에 두면 열려 있는 동안 overlayStore에 자리를 잡는다.
export function OverlayPresence() {
  useEffect(() => {
    overlayStore.open();
    return () => overlayStore.close();
  }, []);
  return null;
}
