export const OPEN_PALETTE_EVENT = "admin:open-palette";

// 머리말 런처(shared)가 팔레트(feature)를 import하지 않고 여는 통로.
export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
