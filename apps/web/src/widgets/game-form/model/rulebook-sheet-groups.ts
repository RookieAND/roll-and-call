import { canPickRulebook, CERT_STATE, type MyRulebooks } from "@/entities/rulebook";

// 시트 순서: 내가 인증한 룰북, 인증 없이 열 수 있는 룰, 인증이 필요한 룰북. 검색어는 이름·판본·다른 이름에서 찾는다.
export function rulebookSheetGroups(
  { rulebooks, enforcementDate }: MyRulebooks,
  query: string,
  now = new Date(),
) {
  const keyword = query.trim().toLowerCase();
  const shown = rulebooks.filter(
    (rulebook) =>
      !keyword ||
      [rulebook.label, ...rulebook.aliases].some((text) => text.toLowerCase().includes(keyword)),
  );
  const toOption = (rulebook: (typeof rulebooks)[number]) => ({
    rulebook,
    pickable: canPickRulebook(rulebook, enforcementDate, now),
  });
  return {
    mine: shown
      .filter((rulebook) => rulebook.certRequired && rulebook.state === CERT_STATE.certified)
      .map(toOption),
    free: shown.filter((rulebook) => !rulebook.certRequired).map(toOption),
    needed: shown
      .filter((rulebook) => rulebook.certRequired && rulebook.state !== CERT_STATE.certified)
      .map(toOption),
  };
}
