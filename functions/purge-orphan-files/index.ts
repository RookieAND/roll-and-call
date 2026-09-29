import { createClient } from "npm:@supabase/supabase-js@2";

// pg_cron이 하루 한 번 부른다(packages/database/drizzle/0041_purge_orphan_files.sql).
// 지울 목록은 DB 함수 orphan_storage_objects가 정한다. 스토리지 행을 SQL로 지우면 실제 파일이 남아서
// 서비스 키를 가진 이 함수가 Storage API로 지운다.
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async () => {
  const { data, error } = await supabase.rpc("orphan_storage_objects");
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const byBucket = Map.groupBy(
    data as { bucket_id: string; name: string }[],
    (object) => object.bucket_id,
  );
  const removed: Record<string, number> = {};
  for (const [bucket, objects] of byBucket) {
    const { data: gone, error: removeError } = await supabase.storage
      .from(bucket)
      .remove(objects.map((object) => object.name));
    if (removeError) return Response.json({ error: removeError.message, removed }, { status: 500 });
    removed[bucket] = gone.length;
  }
  return Response.json({ removed });
});
