import { DIALOG_ROW_TONE, type DialogRowTone } from "./confirm-dialog-content";

export function dialogRowForeground(tone: DialogRowTone) {
  if (tone === DIALOG_ROW_TONE.new) return "success";
  if (tone === DIALOG_ROW_TONE.old) return "hint";
  return "normal";
}
