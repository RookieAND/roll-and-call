// 운영진 알림에는 첫 책 이름과 나머지 권수만 적는다.
export function bulkNoticeLabel({ labels }: { labels: readonly string[] }) {
  const [first = "", ...rest] = labels;
  return rest.length > 0 ? `${first} 외 ${rest.length}권` : first;
}
