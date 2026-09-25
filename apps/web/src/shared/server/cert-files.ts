import "server-only";
import { certApplications, db } from "@roll-and-call/database";
import { eq } from "drizzle-orm";
import { compact, uniq } from "es-toolkit";

import { CERT_PHOTO_BUCKET, certPhotoPathOf } from "@/shared/lib";

import { createSupabaseServerClient } from "./auth/create-supabase-server-client";

// 다시 신청하면 문제없던 사진 URL을 옮겨 쓰고, 여러 권 신청은 사진을 나눠 쓰므로 이 사람의 다른 신청이 쓰는 사진은 남긴다.
// ponytail: best-effort. 지우지 못하면 파일이 남을 뿐 취소는 막지 않는다.
export async function removeUnusedCertPhotos(userId: string, urls: string[]) {
  const candidates = uniq(compact(urls));
  if (candidates.length === 0) return;
  const remaining = await db
    .select({
      photoUrls: certApplications.photoUrls,
      captureUrl: certApplications.purchaseCaptureUrl,
    })
    .from(certApplications)
    .where(eq(certApplications.userId, userId));
  const inUse = new Set(
    remaining.flatMap((row) => [...Object.values(row.photoUrls), row.captureUrl]),
  );
  const paths = compact(candidates.filter((url) => !inUse.has(url)).map(certPhotoPathOf));
  if (paths.length === 0) return;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(CERT_PHOTO_BUCKET).remove(paths);
  if (error) console.error("[cert-files] storage remove failed:", error.message);
}
