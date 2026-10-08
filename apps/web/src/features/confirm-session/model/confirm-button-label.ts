export function confirmButtonLabel({ failed, changing }: { failed: boolean; changing: boolean }) {
  if (failed) return "다시 시도";
  return changing ? "바꾸기" : "확정";
}
