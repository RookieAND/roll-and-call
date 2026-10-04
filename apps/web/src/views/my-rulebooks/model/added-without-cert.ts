import type { MyRulebook } from "@/entities/rulebook";

// 요청과 추가된 책을 잇는 칸이 없어 이름(또는 연결 때 더한 다른 이름)으로 찾는다. 못 찾으면 인증이 필요한 책으로 본다.
export function addedWithoutCert({
  request,
  rulebooks,
}: {
  request: { label: string };
  rulebooks: MyRulebook[];
}) {
  const added = rulebooks.find(
    (rulebook) => rulebook.label === request.label || rulebook.aliases.includes(request.label),
  );
  return added ? !added.certRequired : false;
}
