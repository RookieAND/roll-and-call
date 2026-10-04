import { firstFreeNickname, nicknameBaseOf } from "./member-nickname";

export interface NicknameSyncChange {
  userId: string;
  from: string;
  to: string;
  suffixBase: string | null;
}

// 가입 순으로 디스코드 서버 닉네임을 배정한다. 겹치면 먼저 가입한 사람이 원래 이름을 갖고 뒷사람은 숫자를 붙인다.
// 미리 만든 프로필(hasAccount false)과 디스코드 이름을 모르는 사람(null)은 지금 닉네임을 원한다.
export function planNicknameSync({
  members,
  guildNames,
}: {
  members: { userId: string; nickname: string; hasAccount: boolean }[];
  guildNames: ReadonlyMap<string, string | null>;
}) {
  const taken = new Set<string>();
  const changes: NicknameSyncChange[] = [];
  let kept = 0;
  for (const member of members) {
    const guildName = member.hasAccount ? guildNames.get(member.userId) : null;
    const wanted = nicknameBaseOf(guildName) ?? member.nickname;
    const { nickname, suffixed } = firstFreeNickname({ base: wanted, taken });
    taken.add(nickname.toLowerCase());
    if (nickname === member.nickname && !suffixed) kept += 1;
    else {
      changes.push({
        userId: member.userId,
        from: member.nickname,
        to: nickname,
        suffixBase: suffixed ? wanted : null,
      });
    }
  }
  return { changes, kept };
}
