-- 가입할 수 없는 사람에게 보여 줄 디스코드 초대 링크. trpia는 도움말에 있던 링크로 채운다.
ALTER TABLE "servers" ADD COLUMN "invite_url" text;--> statement-breakpoint
UPDATE "servers" SET "invite_url" = 'https://discord.gg/22q39AUyXc' WHERE "slug" = 'trpia';
