-- 코드 배포 뒤에 적용한다. 0050에서 칼럼 추가와 함께 있던 삭제를 떼어 냈다(옛 코드는 games를 통째로 읽어 이 칼럼이 필요하다).
ALTER TABLE "games" DROP COLUMN "edit_requested_at";
