export function nextLabel({
  welcome,
  last,
  fromHelp,
}: {
  welcome: boolean;
  last: boolean;
  fromHelp: boolean;
}) {
  if (welcome) return "둘러보기";
  if (last && fromHelp) return "도움말로 돌아가기";
  if (last) return "구인 목록 보러 가기";
  return "다음";
}
