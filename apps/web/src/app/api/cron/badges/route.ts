import { isCronRequest, runBadgesCron } from "@/shared/server";

export const maxDuration = 300;

export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  return Response.json(await runBadgesCron());
}
