ALTER TABLE "rulebooks" ADD COLUMN "mini_rule" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "rulebooks" SET "mini_rule" = true WHERE "name" IN ('피아스코', '너냐?!', '다이얼렉트', '퀼', '여왕을 위하여');--> statement-breakpoint
-- 새 서버가 trpia의 룰북을 복사할 때 미니룰 여부도 가져간다.
CREATE OR REPLACE FUNCTION public.copy_default_rulebooks(target uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  source uuid := (SELECT id FROM public.servers WHERE slug = 'trpia');
BEGIN
  IF source IS NULL OR source = target THEN
    RETURN;
  END IF;
  CREATE TEMP TABLE IF NOT EXISTS rulebook_copy_map (old_id uuid, new_id uuid) ON COMMIT DROP;
  DELETE FROM pg_temp.rulebook_copy_map;
  INSERT INTO pg_temp.rulebook_copy_map
    SELECT id, gen_random_uuid() FROM public.rulebook_categories WHERE server_id = source;
  INSERT INTO pg_temp.rulebook_copy_map
    SELECT id, gen_random_uuid() FROM public.rulebooks WHERE server_id = source;
  INSERT INTO public.rulebook_categories (id, server_id, name, created_at)
    SELECT m.new_id, target, c.name, c.created_at
    FROM public.rulebook_categories c
    JOIN pg_temp.rulebook_copy_map m ON m.old_id = c.id;
  INSERT INTO public.rulebooks
    (id, server_id, category_id, name, edition, kind, supersedes_id, aliases, cert_required, mini_rule, hidden, created_at)
    SELECT m.new_id, target, category.new_id, r.name, r.edition, r.kind, superseded.new_id,
      r.aliases, r.cert_required, r.mini_rule, r.hidden, r.created_at
    FROM public.rulebooks r
    JOIN pg_temp.rulebook_copy_map m ON m.old_id = r.id
    JOIN pg_temp.rulebook_copy_map category ON category.old_id = r.category_id
    LEFT JOIN pg_temp.rulebook_copy_map superseded ON superseded.old_id = r.supersedes_id;
  INSERT INTO public.cert_sellers (server_id, name, created_at)
    SELECT target, name, created_at FROM public.cert_sellers WHERE server_id = source
    ON CONFLICT DO NOTHING;
  UPDATE public.games g SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE g.server_id = target AND g.rulebook_id = m.old_id;
  UPDATE public.cert_applications a SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE a.server_id = target AND a.rulebook_id = m.old_id;
  UPDATE public.certifications c SET rulebook_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE c.server_id = target AND c.rulebook_id = m.old_id;
  UPDATE public.rulebook_requests q SET category_id = m.new_id
    FROM pg_temp.rulebook_copy_map m WHERE q.server_id = target AND q.category_id = m.old_id;
END;
$$;
