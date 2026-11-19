// 취소가 마감보다 앞선다. 둘 다 아니면 붙이지 않는다.
export function recruitPostStatus({ cancelled, closed }: { cancelled: boolean; closed: boolean }) {
  if (cancelled) return "(취소됨) ";
  if (closed) return "[마감] ";
  return "";
}
