export function reviewNextHref({
  fromReports,
  nextReportedId,
}: {
  fromReports: boolean;
  nextReportedId: string | null;
}) {
  if (!fromReports) return null;
  if (nextReportedId) return `/reviews/${nextReportedId}?from=reports`;
  return "/reviews";
}
