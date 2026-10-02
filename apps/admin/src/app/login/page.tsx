import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSessionAccount } from "@/shared/server";
import { LoginView } from "@/views/login";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getSessionAccount()) redirect("/");
  const { error } = await searchParams;
  return <LoginView failed={Boolean(error)} />;
}
