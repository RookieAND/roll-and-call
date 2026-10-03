import { DiscordApiError } from "@roll-and-call/discord";
import { limitAsync, retry } from "es-toolkit";

export const MEMBER_CHECK_CONCURRENCY = 5;

const isRateLimited = (error: unknown) => error instanceof DiscordApiError && error.status === 429;

export type DepartedMembers<Member> =
  | { skipped: false; checked: number; departed: Member[] }
  | { skipped: true; checked: number; departed: [] };

// 한 서버의 멤버를 동시에 5명까지 확인한다. 429면 retry_after만큼 기다렸다 한 번 더 부른다.
// 한 명이라도 확인에 실패하면(403·5xx·연결 끊김) 그 서버는 건너뛰어 아무도 탈퇴 처리하지 않는다.
export async function findDepartedMembers<Member>({
  members,
  isMember,
}: {
  members: Member[];
  isMember: (member: Member) => Promise<boolean>;
}): Promise<DepartedMembers<Member>> {
  const check = limitAsync(
    (member: Member) =>
      retry(() => isMember(member), {
        retries: 1,
        shouldRetry: isRateLimited,
        delay: (_attempt, error) => ((error as DiscordApiError).retryAfter ?? 1) * 1000,
      }),
    MEMBER_CHECK_CONCURRENCY,
  );
  const results = await Promise.allSettled(members.map((member) => check(member)));
  if (results.some((result) => result.status === "rejected")) {
    return { skipped: true, checked: 0, departed: [] };
  }
  return {
    skipped: false,
    checked: members.length,
    departed: members.filter(
      (_member, index) => (results[index] as PromiseFulfilledResult<boolean>).value === false,
    ),
  };
}
