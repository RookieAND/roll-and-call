export function reviewNextHref({
  fromReports,
  nextReportedId,
}: {
  fromReports: boolean;
  nextReportedId: string | null;
}) {
  if (!fromReports) return null;
  if (nextReportedId) return `/posts/reviews/${nextReportedId}?from=reports`;
  return "/posts/reviews";
}
