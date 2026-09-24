import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentStaff } from "@/shared/server";
import { LoginView } from "@/views/login";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff") redirect("/");
  if (staff.status === "denied") redirect("/denied");
  const { error } = await searchParams;
  return <LoginView failed={Boolean(error)} />;
}
