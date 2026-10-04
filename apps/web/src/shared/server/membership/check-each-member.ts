import { DiscordApiError } from "@roll-and-call/discord";
import { limitAsync, retry } from "es-toolkit";

export const MEMBER_CHECK_CONCURRENCY = 5;

const isRateLimited = (error: unknown) => error instanceof DiscordApiError && error.status === 429;

// 한 서버의 멤버를 동시에 5명까지 봇으로 확인한다. 429면 retry_after만큼 기다렸다 한 번 더 부른다.
// 한 명이라도 확인에 실패하면(403·5xx·연결 끊김) undefined라, 부르는 쪽이 그 서버를 건너뛴다.
export async function checkEachMember<Member, Result>({
  members,
  check,
}: {
  members: Member[];
  check: (member: Member) => Promise<Result>;
}): Promise<Result[] | undefined> {
  const limitedCheck = limitAsync(
    (member: Member) =>
      retry(() => check(member), {
        retries: 1,
        shouldRetry: isRateLimited,
        delay: (_attempt, error) => ((error as DiscordApiError).retryAfter ?? 1) * 1000,
      }),
    MEMBER_CHECK_CONCURRENCY,
  );
  const results = await Promise.allSettled(members.map((member) => limitedCheck(member)));
  if (results.some((result) => result.status === "rejected")) return undefined;
  return results.map((result) => (result as PromiseFulfilledResult<Result>).value);
}
