"use client";

import { useEffect } from "react";

import { overlayStore } from "./overlay-store";

export function OverlayPresence() {
  useEffect(() => {
    overlayStore.open();
    return () => overlayStore.close();
  }, []);
  return null;
}
