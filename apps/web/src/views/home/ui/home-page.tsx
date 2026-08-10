import Link from "next/link";
import { Container, VStack } from "@trpg/ui";
import { createClient } from "@/shared/api/supabase/server";
import { LoginButton, SignOutButton } from "@/features/auth";

export async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata.full_name ??
    user?.user_metadata.name ??
    user?.email ??
    "";

  return (
    <Container size="md">
      <VStack align="center" justify="center" gap={4} className="min-h-screen">
        <h1 className="text-2xl font-bold">TRPG 예약 · 일정 조율</h1>
        {user ? (
          <>
            <p className="text-gray-600">{displayName}님 환영합니다</p>
            <Link
              href="/games"
              className="rounded-md bg-black px-4 py-2 font-medium text-white"
            >
              구인 목록 보기
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <p className="text-gray-500">Discord 계정으로 시작하세요</p>
            <LoginButton />
          </>
        )}
      </VStack>
    </Container>
  );
}
