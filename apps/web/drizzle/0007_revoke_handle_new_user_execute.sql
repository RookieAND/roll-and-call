-- Custom SQL migration file, put your code below! --

-- handle_new_user() is SECURITY DEFINER and only ever runs from the on_auth_user_created
-- trigger, but PostgREST exposes every public function at /rest/v1/rpc/. Revoke EXECUTE so
-- anon/authenticated can't call it directly. Runtime trigger firing does not need the grant
-- (EXECUTE is checked when the trigger is created, not when it fires).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
