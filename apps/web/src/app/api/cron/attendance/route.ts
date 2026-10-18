import { isCronRequest, runAttendanceCron } from "@/shared/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  return Response.json(await runAttendanceCron());
}
