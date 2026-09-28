import { getCurrentSessionUser } from "@/shared/server";

import { loadMyRulebooks } from "../api/load-my-rulebooks";
import { MyPageRulebooks } from "./my-page-rulebooks";

export async function MyPageRulebooksSection() {
  const user = (await getCurrentSessionUser())!;
  return <MyPageRulebooks rulebooks={await loadMyRulebooks(user.id)} />;
}
