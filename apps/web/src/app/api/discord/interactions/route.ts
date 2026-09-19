import { NextResponse } from "next/server";

import { buildInteractionResponse } from "./_lib/build-interaction-response";
import type { DiscordInteraction } from "./_lib/interaction-types";
import { verifyDiscordRequest } from "./_lib/verify-discord-request";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await verifyDiscordRequest(request);
  if (body === null) {
    return NextResponse.json({ error: "invalid request signature" }, { status: 401 });
  }

  return NextResponse.json(buildInteractionResponse(JSON.parse(body) as DiscordInteraction));
}
