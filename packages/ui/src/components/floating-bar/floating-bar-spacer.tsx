"use client";

import { useContext } from "react";

import { FloatingBarContext } from "./floating-bar-context";

export function FloatingBarSpacer() {
  const { height } = useContext(FloatingBarContext);
  return <div aria-hidden data-slot="floating-bar-spacer" style={{ height }} />;
}
