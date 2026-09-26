-- 구인은 룰을 "카테고리 판본"(예: 더블크로스 3rd)으로 고른다. 이름·다른 이름이 먼저 맞고,
-- 없으면 그 카테고리·판본의 기본 룰북 가운데 먼저 등록된 책으로 잇는다.
CREATE OR REPLACE FUNCTION public.match_rulebook(rule text)
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT r.id FROM public.rulebooks r
  JOIN public.rulebook_categories c ON c.id = r.category_id
  WHERE lower(trim(rule)) = lower(trim(r.name || ' ' || r.edition))
     OR lower(trim(rule)) = ANY (SELECT lower(trim(a)) FROM unnest(r.aliases) a)
     OR (r.kind = 'core' AND lower(trim(rule)) = lower(trim(c.name || ' ' || r.edition)))
  ORDER BY
    r.hidden,
    (lower(trim(rule)) = lower(trim(r.name || ' ' || r.edition))
      OR lower(trim(rule)) = ANY (SELECT lower(trim(a)) FROM unnest(r.aliases) a)) DESC,
    r.created_at
  LIMIT 1
$$;
--> statement-breakpoint
UPDATE "games" SET "rulebook_id" = public.match_rulebook("rule")
  WHERE "rulebook_id" IS DISTINCT FROM public.match_rulebook("rule");
