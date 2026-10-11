-- 실물 인증 사진을 앞면·뒷면 두 장으로 줄였다. 예전 신청에 남은 책등(side) 사진 연결과 표시를 걷어낸다.
-- 사진 파일은 연결이 끊기면 하루 정리 함수 orphan_storage_objects(0041)가 지운다.
UPDATE "cert_applications"
SET "photo_urls" = "photo_urls" - 'side',
    "replaced_shots" = array_remove("replaced_shots", 'side'),
    "flagged_shots" = array_remove("flagged_shots", 'side')
WHERE "photo_urls" ? 'side'
   OR 'side' = ANY("replaced_shots")
   OR 'side' = ANY("flagged_shots");
